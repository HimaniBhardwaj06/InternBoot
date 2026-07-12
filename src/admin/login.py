from admin.dashboard import admin_dashboard


def admin_login():

    print("\n" + "=" * 55)
    print("             ADMIN LOGIN")
    print("=" * 55)

    username = input("Username : ").strip()
    password = input("Password : ").strip()

    if username == "admin" and password == "admin123":

        print("\n✅ Login Successful!")

        admin_dashboard()

    else:

        print("\n❌ Invalid Username or Password.")