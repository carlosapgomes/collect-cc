-- create an admin user with password '1234'
-- use this file after starting your local server for the first time
-- use as: "sqlite3 collect.sqlite < ./createAdmin.sql"
insert into users(id,name,email,phone,username,password,isAdmin,isListingEnabled,isLoginEnabled,changePassword,profBoardName,licenceNumber,createdAt,updatedAt) values(1,'admin','admin@user.domain','1234567','admin','$2a$10$N7OxArYhN7X0QCoEk/O7jO8SdOUuwKJBNSCNY3mFq7yUOP.k/VJ02',1,1,1,1,'CRM','1234',datetime(),datetime());
