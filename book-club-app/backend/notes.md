file structure:

├── app.ts
├── config
│   ├── db.ts
│   └── passport.ts
├── controllers
│   ├── authController.ts
│   ├── bookCatalogController.ts
│   ├── bookClubController.ts
│   ├── soloReadingListController.ts
│   └── userController.ts
├── helpers
│   └── sessionNamespace.ts
├── middleware
│   ├── auth.ts
│   ├── errorHandler.ts
│   └── session.ts
├── models
│   ├── BookClub.ts
│   ├── Book.ts
│   ├── FriendRequest.ts
│   ├── SoloReadingList.ts
│   ├── types.ts
│   └── User.ts
├── routes
│   ├── auth.ts
│   ├── bookClub.ts
│   ├── friendRequest.ts
│   ├── soloReadingList.ts
│   └── user.ts
├── server.ts
├── services
│   ├── bookCatalogService.ts
│   ├── bookClubService.ts
│   ├── soloReadingListService.ts
│   └── userService.ts
└── types
    └── index.ts
