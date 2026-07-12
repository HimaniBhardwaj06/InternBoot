from datetime import date, timedelta
from utils.database import connect_db
from admin.books import view_books


def borrow_book(user):

    connection = connect_db()

    if not connection:
        print("\n❌ Database Connection Failed.")
        return

    cursor = connection.cursor(dictionary=True)

    print("\n📚 Available Books\n")

    view_books()

    try:
        book_id = int(input("\nEnter Book ID to Borrow: "))
    except ValueError:
        print("\n❌ Invalid Book ID.")
        cursor.close()
        connection.close()
        return

    cursor.execute(
        "SELECT * FROM books WHERE book_id=%s",
        (book_id,)
    )

    book = cursor.fetchone()

    # Check if user has already borrowed this book

    cursor.execute(
        """
        SELECT *
        FROM borrow_records
        WHERE user_id = %s
        AND book_id = %s
        AND return_date IS NULL
        """,
        (user["user_id"], book_id)
    )

    already_borrowed = cursor.fetchone()

    if already_borrowed:
        print("\n❌ You have already borrowed this book.")
        print("📖 Please return it before borrowing again.")

        cursor.close()
        connection.close()
        input("\nPress Enter to continue...")
        return

    if not book:
        print("\n❌ Book not found.")
        cursor.close()
        connection.close()
        return

    if book["available_copies"] <= 0:
        print("\n❌ This book is currently unavailable.")
        cursor.close()
        connection.close()
        return

    borrow_date = date.today()
    due_date = borrow_date + timedelta(days=14)

    cursor.execute( """ INSERT INTO borrow_records (user_id, book_id, borrow_date, due_date) VALUES (%s, %s, %s, %s)""", (
            user["user_id"], book_id, borrow_date, due_date ))

    cursor.execute( """ UPDATE books SET available_copies = available_copies - 1 WHERE book_id=%s """, (book_id,) )

    connection.commit()

    print("\n✅ Book Borrowed Successfully!")

    cursor.close()
    connection.close()

    input("\nPress Enter to continue...")