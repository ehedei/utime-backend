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
|POST|**/appointment**|Register a new Appointment in the App|Admin, Op|**doctor**, **start**, **end**, booking|Appointment created|-|
|PUT|**/appointment/:appointmentId**|Update a Appointment by id|Admin, Op|doctor, start, end|Appointment updated|-|
|DELETE|**/appointment/:appointmentId** |Delete an Appointment by appointmentId|Admin|-|Deleted Appointment|-

##
<br>

- ### Doctor

|Verb|Route|Description|Auth.|Body Params|Returns|Notes|
|-|-|-|-|-|-|-|
|GET|**/doctor** |Get a list of all Doctors|Admin, Op, User|-|List with all Doctors|-
|GET|**/doctor/:doctorId** |Get a Doctor by Id|Admin, Op, User|-|Doctor|-
|POST|**/doctor** |Create a new Doctor |Admin|**name**|Created Doctor|-
|PUT|**/doctor/:doctorId** |Update a Doctor by Id|Admin|name|Updated Doctor|-
|DELETE|**/doctor/:doctorId** |Delete a Doctor by doctorId|Admin|-|Deleted doctor|-

##
<br>

- ### Specialty

|Verb|Route|Description|Auth.|Body Params|Returns|Notes|
|-|-|-|-|-|-|-|
|GET|**/specialty** |Get a list of all Specialtys|Admin, Op, User|-|List with all Specialties|-
|GET|**/specialty/:specialtyId/doctor** |Get a list of all Doctors by Specialty|Admin, Op, Doc, User|-|List of Doctors|-
|GET|**/specialty/:specialtyId** |Get a Specialty by Id|Admin, Op, User|-|Specialty|-
|POST|**/specialty** |Create a new Specialty |Admin|**name**|Created Specialty|-
|PUT|**/specialty/:specialtyId** |Update a Specialty by Id|Admin|name|Updated Specialty|-
|DELETE|**/specialty/:specialtyId** |Delete a Specialty by specialtyId|Admin|-|Deleted specialty|-

##

