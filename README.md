# A mobile app developed with React Native

## Setup

- Git clone the repository
- Then open terminal, run script: npm install
- In case you haven't installed expo through npm installation, download and install expo -CLI for later use
- Setup all environment for android (Using android studio), which includes:

  - Cmake
  - Android SDK build-tool
  - Android SDK platform
  - Android Emulator
  - NDK (side-by-side)
  - Android 15 (VanillaCream) and Android 14 (UpsideDownCaked)
  - Hermes (optional)

## Building

- Create and start a new device with android studio
- Run script: npm start (npm expo start)
- After running this, expo will take care everything about building and rendering app.
  The first build may take a while.

## Developing

- Every new screen needs to be setup as a new file, with capital first letter
- Several used components must be stored in the same folder
- Icons, pictures should be stored in assets or some similar directory

//token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MzMxMjQwMTUsImV4cCI6MTczMzIxMDQxNX0.Z4NmDkUvfGj3EKd53uFeSNB0AWmR5Z7mufMJ7iNzjS4

"data": [
{
"id": 8,
"createdAt": "2024-12-29T20:03:35.159675",
"updatedAt": "2024-12-29T20:03:35.168808",
"name": "Shopping",
"note": "nothing",
"date": "2024-12-29T17:00:00.000+00:00",
"details": [
{
"id": 9,
"createdAt": "2024-12-29T20:04:05.575964",
"updatedAt": "2024-12-29T20:04:05.576031",
"quantity": 10,
"done": false,
"foodName": "Phở bò",
"foodImage": "https://ducanh-food-app.s3.amazonaws.com/food/7/phở bò1735143356541",
"food_id": 8,
"shopping_list_id": 8
}
],
"owner_id": 2,
"assign_to_user_id": 2,
"belong_to_group_id": 7
}
]
