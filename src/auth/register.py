import re
from utils.database import connect_db


def validate_email(email):
    pattern = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    return re.match(pattern, email)


def validate_phone(phone):
    return phone.isdigit() and len(phone) == 10


def validate_password(password):
    if len(password) < 8:
        return False

    has_upper = any(char.isupper() for char in password)
    has_lower = any(char.islower() for char in password)
    has_digit = any(char.isdigit() for char in password)

    return has_upper and has_lower and has_digit


def email_exists(email):
    connection = connect_db()

    if not connection:
        return False

    cursor = connection.cursor()

    query = "SELECT * FROM users WHERE email = %s"
    cursor.execute(query, (email,))

    result = cursor.fetchone()

    cursor.close()
    connection.close()

    return result is not None


def register_user():
    print("\n" + "=" * 55)
    print("           📚 LIBRARY MANAGEMENT SYSTEM")
    print("-" * 55)
    print("               USER REGISTRATION")
    print("=" * 55)

    full_name = input("Enter Full Name : ").strip()
    email = input("Enter Email      : ").strip()
    phone = input("Enter Phone No.  : ").strip()
    password = input("Enter Password   : ").strip()

    # ---------- Validation ----------

    if len(full_name) < 3:
        print("\n❌ Name must contain at least 3 characters.")
        return

    if not validate_email(email):
        print("\n❌ Invalid Email Address.")
        return

    if not validate_phone(phone):
        print("\n❌ Phone number must contain exactly 10 digits.")
        return

    if not validate_password(password):
        print("\n❌ Password must contain:")
        print("   • At least 8 characters")
        print("   • One uppercase letter")
        print("   • One lowercase letter")
        print("   • One number")
        return

    if email_exists(email):
        print("\n❌ This email is already registered.")
        return

    # ---------- Save User ----------

    connection = connect_db()

    if not connection:
        print("\n❌ Database Connection Failed.")
        return

    cursor = connection.cursor()

    query = """ INSERT INTO users (full_name, email, phone, password) VALUES (%s, %s, %s, %s) """

    values = (full_name, email, phone, password)

   
   

    try:
        cursor.execute(query, values)
        connection.commit()

        print("\n✅ Registration Successful!")
        input("\nPress Enter to continue...")

    except Exception as e:
        print("\n❌ Registration Failed!")
        print(e)

    finally:
        cursor.close()
        connection.close()