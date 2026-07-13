from utils.database import connect_db


def add_book():

    print("\n" + "=" * 55)
    print("                 ADD NEW BOOK")
    print("=" * 55)

    title = input("Book Title : ").strip()
    author = input("Author     : ").strip()
    category = input("Category   : ").strip()
    isbn = input("ISBN (Optional): ").strip()

    try:
        quantity = int(input("Quantity   : "))
    except ValueError:
        print("\n❌ Quantity must be a number.")
        return

    if title == "" or author == "" or category == "":
        print("\n❌ All fields are required.")
        return

    if quantity <= 0:
        print("\n❌ Quantity must be greater than zero.")
        return

    if isbn == "":
        isbn = None

    connection = connect_db()

    if not connection:
        print("\n❌ Database Connection Failed.")
        return

    cursor = connection.cursor()

    query = """
    INSERT INTO books(title, author, category, ISBN, total_copies, available_copies)
    VALUES(%s, %s, %s, %s, %s, %s)
    """

    values = (
        title,
        author,
        category,
        isbn,
        quantity,
        quantity
    )

    try:
        cursor.execute(query, values)
        connection.commit()

        print("\n✅ Book Added Successfully!")
        input("\nPress Enter to continue...")

    except Exception as e:
        print("\n❌ Failed to Add Book.")
        print(e)

    finally:
        cursor.close()
        connection.close()


def view_books():

    connection = connect_db()

    if not connection:
        print("\n❌ Database Connection Failed.")
        return

    cursor = connection.cursor()

    cursor.execute("""
        SELECT book_id, title, author, category,
               available_copies, total_copies
        FROM books
    """)

    books = cursor.fetchall()

    if not books:
        print("\n📚 No books available.")
    else:

        print("\n" + "=" * 105)
        print(f"{'ID':<5}{'TITLE':<30}{'AUTHOR':<25}{'CATEGORY':<20}{'AVAILABLE/TOTAL'}")
        print("=" * 105)

        for book in books:

            title = book[1][:27] + ".." if len(book[1]) > 30 else book[1]
            author = book[2][:22] + ".." if len(book[2]) > 25 else book[2]
            category = book[3][:17] + ".." if len(book[3]) > 20 else book[3]

            print(
                f"{book[0]:<5}"
                f"{title:<30}"
                f"{author:<25}"
                f"{category:<20}"
                f"{book[4]}/{book[5]}"
            )

        print("=" * 120)

    cursor.close()
    connection.close()

def update_book():

    connection = connect_db()

    if not connection:
        print("\n❌ Database Connection Failed.")
        return

    cursor = connection.cursor(dictionary=True)

    view_books()

    try:
        book_id = int(input("\nEnter Book ID to Update: "))
    except ValueError:
        print("\n❌ Invalid Book ID.")
        cursor.close()
        connection.close()
        return

    cursor.execute("SELECT * FROM books WHERE book_id=%s", (book_id,))
    book = cursor.fetchone()

    if not book:
        print("\n❌ Book not found.")
        cursor.close()
        connection.close()
        return

    print("\nPress Enter to keep the current value.\n")

    title = input(f"Title ({book['title']}): ").strip()
    author = input(f"Author ({book['author']}): ").strip()
    category = input(f"Category ({book['category']}): ").strip()
    isbn = input(f"ISBN ({book['ISBN']}): ").strip()

    total = input(f"Total Copies ({book['total_copies']}): ").strip()

    if title == "":
        title = book["title"]

    if author == "":
        author = book["author"]

    if category == "":
        category = book["category"]

    if isbn == "":
        isbn = book["ISBN"]

    if total == "":
        total = book["total_copies"]
    else:
        try:
            total = int(total)
        except ValueError:
            print("\n❌ Total copies must be a number.")
            cursor.close()
            connection.close()
            return

    available = total

    query = """ UPDATE books SET title=%s, author=%s, category=%s, ISBN=%s, total_copies=%s, available_copies=%s WHERE book_id=%s """

    values = ( title, author, category, isbn, total, available, book_id )

    cursor.execute(query, values)
    connection.commit()

    print("\n✅ Book Updated Successfully!")

    cursor.close()
    connection.close()

def delete_book():

    connection = connect_db()

    if not connection:
        print("\n❌ Database Connection Failed.")
        return

    cursor = connection.cursor(dictionary=True)

    view_books()

    try:
        book_id = int(input("\nEnter Book ID to Delete: "))
    except ValueError:
        print("\n❌ Invalid Book ID.")
        cursor.close()
        connection.close()
        return

    cursor.execute("SELECT * FROM books WHERE book_id=%s", (book_id,))
    book = cursor.fetchone()

    if not book:
        print("\n❌ Book not found.")
        cursor.close()
        connection.close()
        return

    confirm = input(f"\nAre you sure you want to delete '{book['title']}'? (Y/N): ").strip().lower()

    if confirm != "y":
        print("\n❌ Delete Cancelled.")
        cursor.close()
        connection.close()
        return

    cursor.execute("DELETE FROM books WHERE book_id=%s", (book_id,))
    connection.commit()

    print("\n✅ Book Deleted Successfully!")
    input("\nPress Enter to continue...")

    cursor.close()
    connection.close()

def search_book():

    connection = connect_db()

    if not connection:
        print("\n❌ Database Connection Failed.")
        return

    cursor = connection.cursor()

    print("\n" + "=" * 55)
    print("               SEARCH BOOK")
    print("=" * 55)
    print("1. Search by Title")
    print("2. Search by Author")
    print("3. Search by Category")
    print("4. Back")

    choice = input("\nEnter your choice: ")

    if choice == "1":
        keyword = input("Enter Book Title: ")
        query = "SELECT * FROM books WHERE title LIKE %s"

    elif choice == "2":
        keyword = input("Enter Author Name: ")
        query = "SELECT * FROM books WHERE author LIKE %s"

    elif choice == "3":
        keyword = input("Enter Category: ")
        query = "SELECT * FROM books WHERE category LIKE %s"

    elif choice == "4":
        cursor.close()
        connection.close()
        return

    else:
        print("\n❌ Invalid Choice")
        cursor.close()
        connection.close()
        return

    cursor.execute(query, ("%" + keyword + "%",))
    books = cursor.fetchall()

    if books:

        print("\n" + "=" * 105)
        print(f"{'ID':<5}{'TITLE':<30}{'AUTHOR':<25}{'CATEGORY':<20}{'AVAILABLE/TOTAL'}")
        print("=" * 105)

        for book in books:

            title = book[1]
            author = book[2]
            category = book[3]

            if len(title) > 30:
                title = title[:27] + ".."

            if len(author) > 25:
                author = author[:22] + ".."

            if len(category) > 20:
                category = category[:17] + ".."

            print(
                f"{book[0]:<5}"
                f"{title:<30}"
                f"{author:<25}"
                f"{category:<20}"
                f"{book[5]}/{book[6]}"
            )

        print("=" * 120)

    else:
        print("\n📚 No matching books found.")

    cursor.close()
    connection.close()

    input("\nPress Enter to continue...")


def view_book_details():

    connection = connect_db()

    if not connection:
        print("\n❌ Database Connection Failed.")
        return

    cursor = connection.cursor(dictionary=True)

    try:
        book_id = int(input("\nEnter Book ID: "))
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

    if not book:
        print("\n❌ Book not found.")

    else:

        print("\n" + "=" * 60)
        print("                 📖 BOOK DETAILS")
        print("=" * 60)

        print(f"Book ID           : {book['book_id']}")
        print(f"Title             : {book['title']}")
        print(f"Author            : {book['author']}")
        print(f"Category          : {book['category']}")
        print(f"ISBN              : {book['ISBN']}")
        print(f"Total Copies      : {book['total_copies']}")
        print(f"Available Copies  : {book['available_copies']}")

        print("=" * 60)

    cursor.close()
    connection.close()

    input("\nPress Enter to continue...")