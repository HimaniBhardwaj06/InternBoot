from admin.reports import show_reports
from admin.books import add_book, view_books, update_book, delete_book, search_book,view_book_details

def admin_dashboard():
    while True:

        print("\n" + "=" * 55)
        print("             📚 ADMIN DASHBOARD")
        print("=" * 55)
        print("1. Add Book")
        print("2. View Books")
        print("3. View Book Details")
        print("4. Update Book")
        print("5. Delete Book")
        print("6. Search Book")
        print("7. Reports")
        print("8. Logout")
        print("=" * 55)

        choice = input("Enter your choice: ")

        if choice == "1":
            add_book()

        elif choice == "2":
            view_books()

        elif choice == "3":
            view_book_details()

        elif choice == "4":
            update_book()

        elif choice == "5":
            delete_book()

        elif choice == "6":
            search_book()

        elif choice == "7":
            show_reports()
            
        elif choice == "8":
            print("Logged out successfully!")
            break
        
        else:
            print("\n❌ Invalid Choice.")

        print("\n💡 Tip: Use 'View Book Details' to see the complete information of any book.")