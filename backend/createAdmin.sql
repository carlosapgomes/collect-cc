-- create an admin user with password '1234'
insert into users(id,username,email,password,isAdmin,isDoctor,isEnabled,changePassword,createdAt,updatedAt) values(1,'admin','admin@user.domain','$2a$10$N7OxArYhN7X0QCoEk/O7jO8SdOUuwKJBNSCNY3mFq7yUOP.k/VJ02',1,1,1,1,datetime(),datetime());
