# UTime API


## API Endpoints
All the endpoints are preceeded by `/api`.

- ### Auth

|Verb|Route|Description|Auth.|Body Params|Returns|Notes|
|-|-|-|-|-|-|-|
|POST|**/auth/signup**|Register a new User in the App|-|**username**, **email**, **password**, |User created|-|
|POST|**/auth/login** |Log in with email and password|-|**email**, **password**|token, username, email, id|-
##
<br>

- ### User

|Verb|Route|Description|Auth.|Body Params|Returns|Notes|
|-|-|-|-|-|-|-|
|GET|**/user** |Get a list of all Users|Admin, Op|-|List with all Users|-
|GET|**/user/:userId** |Get an User by userId|Admin, Op|-|User|-
|GET|**/user/profile** |User get own profile|Admin, Op, User|-|User|-
|POST|**/user**|Register a new User in the App|Admin|**username**, **email**, **password**|User created|-|
|PUT|**/user/:userId**|Update an User by id|Admin|username, email, password|User updated|-|
|PUT|**/user/update**|User updates own profile|Admin, Op, User|username, email, password|User updated|Except _role_|
|DELETE|**/user/:userId** |Delete an User by userId|Admin|-|Deleted User|-

##
<br>

- ### Booking

|Verb|Route|Description|Auth.|Body Params|Returns|Notes|
|-|-|-|-|-|-|-|
|GET|**/booking** |Get a list of all Bookings|Admin, Op, User|-|List with all Bookings|-|
|GET|**/booking/:bookingId** |Get a Booking by bookingId|Admin, Op, User|-|Booking|-|
|POST|**/booking**|Register a new Booking in the App|Admin, Op, User|user, **appointment**|Booking created|-|Admin and Op must provide User
|PUT|**/booking/:bookingId**|Update a Booking by id|Admin, Op, User|appointment, status|Booking updated|-|
|DELETE|**/booking/:bookingId** |Delete an Booking by bookingId|Admin|-|Deleted Booking|-

_\*User only gets own bookings_

##
<br>

- ### Appointment

|Verb|Route|Description|Auth.|Body Params|Returns|Notes|
|-|-|-|-|-|-|-|
|GET|**/appointment** |Get a list of all Appointments|Admin, Op, User|-|List with all Appointments|-|
|GET|**/appointment/:appointmentId** |Get a Appointment by appointmentId|Admin, Op|-|Appointment|-|
|POST|**/appointment**|Register a new Appointment in the App|Admin, Op|**resource**, **start**, **end**, booking|Appointment created|-|
|PUT|**/appointment/:appointmentId**|Update a Appointment by id|Admin, Op|resource, start, end|Appointment updated|-|
|DELETE|**/appointment/:appointmentId** |Delete an Appointment by appointmentId|Admin|-|Deleted Appointment|-

##
<br>

- ### Resource

|Verb|Route|Description|Auth.|Body Params|Returns|Notes|
|-|-|-|-|-|-|-|
|GET|**/resource** |Get a list of all Resources|Admin, Op, User|-|List with all Resources|-
|GET|**/resource/:resourceId** |Get a Resource by Id|Admin, Op, User|-|Resource|-
|POST|**/resource** |Create a new Resource |Admin|**name**|Created Resource|-
|PUT|**/resource/:resourceId** |Update a Resource by Id|Admin|name|Updated Resource|-
|DELETE|**/resource/:resourceId** |Delete a Resource by resourceId|Admin|-|Deleted resource|-

##

