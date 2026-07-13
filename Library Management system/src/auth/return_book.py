from datetime import date

from utils.database import connect_db


def return_book(user):

    connection = connect_db()

    if not connection:
        print("\n❌ Database Connection Failed.")
        return

    cursor = connection.cursor(dictionary=True)

    # Show books borrowed by the current user
    query = """ SELECT br.borrow_id, b.title, br.borrow_date,  br.due_date FROM borrow_records br JOIN books b ON br.book_id = b.book_id
                 WHERE br.user_id = %s AND br.return_date IS NULL """

    cursor.execute(query, (user["user_id"],))
    records = cursor.fetchall()

    if not records:
        print("\n📚 You have no borrowed books.")

        cursor.close()
        connection.close()
        input("\nPress Enter to continue...")
        return

    print("\n" + "=" * 85)
    print("                 MY BORROWED BOOKS")
    print("=" * 85)

    print(f"{'Borrow ID':<12}{'Book Title':<35}{'Borrow Date':<18}{'Due Date'}")
    print("-" * 85)

    for record in records:

        print(
            f"{record['borrow_id']:<12}"
            f"{record['title']:<35}"
            f"{str(record['borrow_date']):<18}"
            f"{record['due_date']}"
        )

    print("=" * 85)

    try:
        borrow_id = int(input("\nEnter Borrow ID to Return: "))
    except ValueError:
        print("\n❌ Invalid Borrow ID.")
        cursor.close()
        connection.close()
        return
        # Check whether Borrow ID belongs to this user

    cursor.execute( """ SELECT * FROM borrow_records WHERE borrow_id=%s AND user_id=%s AND return_date IS NULL """, 
                   (borrow_id, user["user_id"]) )

    record = cursor.fetchone()

    today = date.today()

    late_days = (today - record["due_date"]).days

    fine = 0

    if late_days > 0:
        fine = late_days * 10

        if not record:
            print("\n❌ Invalid Borrow ID.")

            cursor.close()
            connection.close()
            input("\nPress Enter to continue...")
            return


    # Update Return Date

    cursor.execute(""" UPDATE borrow_records SET return_date=%s, fine=%s WHERE borrow_id=%s """, (
                        today, fine, borrow_id))

    # Increase Available Copies

    cursor.execute( """ UPDATE books SET available_copies = available_copies + 1 WHERE book_id=%s """, (record["book_id"],))


    connection.commit()

    print("\n✅ Book Returned Successfully!")

    if fine > 0:
        print(f"💰 Late Fine : ₹{fine}")
    else:
        print("🎉 No Fine. Book returned on time.")

    cursor.close()
    connection.close()

    input("\nPress Enter to continue...")