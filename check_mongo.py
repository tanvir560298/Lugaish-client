import pymongo

client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['lugaish']

print("Collections:", db.list_collection_names())

# Check lessons count
lessons_col = db['lessons']
print("Total lessons in DB:", lessons_col.count_documents({}))
for lesson in lessons_col.find({}, {'day': 1, 'language': 1, 'title': 1, 'modulePublished': 1}):
    print(lesson)

# Check users count
users_col = db['users']
print("Total users in DB:", users_col.count_documents({}))
for user in users_col.find({}, {'email': 1, 'role': 1}):
    print(user)

client.close()
