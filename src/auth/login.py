from auth.return_book import return_book
from auth.borrow import borrow_book
from admin.books import view_books, search_book
from utils.database import connect_db



def login_user():
    print("\n" + "=" * 55)
    print("           📚 LIBRARY MANAGEMENT SYSTEM")
    print("-" * 55)
    print("                  USER LOGIN")
    print("=" * 55)

    email = input("Email    : ").strip()
    password = input("Password : ").strip()

    connection = connect_db()

    if not connection:
        print("\n❌ Database Connection Failed.")
        return

    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT * FROM users
    WHERE email = %s AND password = %s
    """

    cursor.execute(query, (email, password))

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if user:
        print(f"\n✅ Welcome, {user['full_name']}!")
        user_dashboard(user)

    else:
        print("\n❌ Invalid Email or Password.")


def user_dashboard(user):
    while True:

        print("\n" + "=" * 55)
        print(f"        Welcome, {user['full_name']}")
        print("=" * 55)
        print("1. View Available Books")
        print("2. Search Book")
        print("3. Borrow Book")
        print("4. Return Book")
        print("5. Logout")
        print("=" * 55)

        choice = input("Enter your choice: ")

        if choice == "1":
            view_books()

        elif choice == "2":
            search_book()

        elif choice == "3":
            borrow_book(user)

        elif choice == "4":
            return_book(user)

        elif choice == "5":
            print("\n👋 Logged Out Successfully.")
            input("\nPress Enter to continue...")
            break

        else:
            print("\n❌ Invalid Choice.")