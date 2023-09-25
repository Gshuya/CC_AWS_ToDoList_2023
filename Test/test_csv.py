import csv
import random
import string

# Function to generate a random string of given length
def generate_random_string(length):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for _ in range(length))

# Generate sample data
num_entries = 1000  # Number of data entries to generate

data = []
dataUser=[]
for _ in range(num_entries):
    email = generate_random_string(8) + "@gmail.com"
    password = generate_random_string(10)
    dataUser.append([str(email), str(password)])
    for _ in range(10):
        task = generate_random_string(12)
        priority = random.choice(["High", "Medium", "Low"])
        data.append([str(email), str(password), str(task), str(priority)])

# Write data to CSV file
filename = "data.csv"
filenameUser = "dataUser.csv"

with open(filename, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Email", "Password", "Task", "Priority"])  # Write header row
    writer.writerows(data)  # Write data rows

with open(filenameUser, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Email", "Password"])  # Write header row
    writer.writerows(dataUser)  # Write data rows
print(f"Data has been written to {filename,filenameUser}.")