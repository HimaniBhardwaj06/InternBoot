

from admin.login import admin_login
from utils.database import connect_db
from auth.register import register_user
from auth.login import login_user


def display_menu():
    print("\n" + "=" * 52)
    print("         📚 LIBRARY MANAGEMENT SYSTEM 📚")
    print("=" * 52)
    print("1. Admin Login")
    print("2. User Registration")
    print("3. User Login")
    print("4. Exit")
    print("=" * 52)


def main():
    connection = connect_db()

    if not connection:
        print("Failed to connect to the database.")
        return

    while True:
        display_menu()

        choice = input("Enter your choice: ")

        if choice == "1":
            admin_login()

        elif choice == "2":
            register_user()

        elif choice == "3":
            login_user()
            
        elif choice == "4":
            print("\nThank you for using Library Management System.")
            connection.close()
            print("Database connection closed.")
            break

        else:
            print("\nInvalid choice! Please try again.\n")


if __name__ == "__main__":
    main()