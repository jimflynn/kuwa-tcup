<%--
  Created by IntelliJ IDEA.
  User: darshi
  Date: 5/31/18
  Time: 6:49 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>Kuwa Sponsor Demo</title>
  </head>
  <body>

  <form action="rest/sponsor/request" method="post" enctype="multipart/form-data">
    <p> Your public Key: <input type="text" name="public_key"/> </p>
    <p> Your Shared Secret: <input type="text" name="shared_secret"/> </p>
    <input type="submit" value="Submit" />
  </form>

  <%--<p><a href="rest/sponsor/p">Jersey resource</a>--%>

  </body>
</html>
