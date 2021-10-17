# APIs


# API Specification
### Success ### 
When an API call is successful, the JSend object is used as a simple envelope for the results, using the data key, as in the following:
```
{
  "status": "success",
  "data": {
    /* Application-specific data would go here. */
  },
  "message": null /* Or optional success message */
}
```
### Fail ### 
When an API call is rejected due to invalid data or call conditions, the JSend object's data key contains an object explaining what went wrong, typically a hash of validation errors. For example:
```
{
  "status": "error",
  "data": null, /* or optional error payload */
  "message": "Error xyz has occurred"
}
```
### Error ### 
When an API call fails due to an error on the server. For example:
```
{
  "status": "fail",
  "data": null, /* or optional error payload */ 
  /* 
  for example: [
    "email": "Meal name is required",
    "password": "Password" is required"
  ]
  */
  "message": "Error xyz has occurred"
}
```
