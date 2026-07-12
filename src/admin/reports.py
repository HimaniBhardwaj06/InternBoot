from utils.database import connect_db


def show_reports():

    connection = connect_db()

    if not connection:
        print("\n❌ Database Connection Failed.")
        return

    cursor = connection.cursor()

    # Total different books
    cursor.execute("SELECT COUNT(*) FROM books")
    total_books = cursor.fetchone()[0]

    # Total copies
    cursor.execute("SELECT SUM(total_copies) FROM books")
    total_copies = cursor.fetchone()[0] or 0

    # Available copies
    cursor.execute("SELECT SUM(available_copies) FROM books")
    available = cursor.fetchone()[0] or 0

    borrowed = total_copies - available

    # Registered users
    cursor.execute("SELECT COUNT(*) FROM users")
    users = cursor.fetchone()[0]

    # Current borrow records
    cursor.execute(""" SELECT COUNT(*) FROM borrow_records WHERE return_date IS NULL """)
    active = cursor.fetchone()[0]

    # Returned books
    cursor.execute(""" SELECT COUNT(*)  FROM borrow_records WHERE return_date IS NOT NULL """)
    returned = cursor.fetchone()[0]

    print("\n" + "=" * 55)
    print("                 📊 LIBRARY REPORT")
    print("=" * 55)

    print(f"📚 Total Books         : {total_books}")
    print(f"📦 Total Copies        : {total_copies}")
    print(f"✅ Available Copies    : {available}")
    print(f"📖 Borrowed Copies     : {borrowed}")
    print()
    print(f"👤 Registered Users    : {users}")
    print()
    print(f"📕 Currently Borrowed  : {active}")
    print(f"📗 Returned Books      : {returned}")

    print("=" * 55)

    cursor.close()
    connection.close()

    input("\nPress Enter to continue...")