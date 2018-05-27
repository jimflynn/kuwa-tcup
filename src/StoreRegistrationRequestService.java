/**
 *
 * This class runs as a REST service. It stores a registration request info on a server.
 *
 * NOTE: This class reads a properties file, which must be located at a specific path relative to the working directory (see code).
 *
 * By Jim Flynn
 *
 * Last updated: 2018-05-23
 *
 * The Kuwa Foundation Inc
 *
 */
package org.kuwa.storage;

import java.io.*;

import java.util.Properties;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

@Path("/files")

public class StoreRegistrationRequestService {

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)

    public Response uploadFile(
            @FormDataParam("file") InputStream uploadedInputStream,
            @FormDataParam("file") FormDataContentDisposition fileDetail,
            @FormDataParam("secret") String secretparam,
            @FormDataParam("challenge") String challenge,
            @FormDataParam("address") String address) {

        // Read properties file containing the output directory and shared secret.
        Properties prop = new Properties();
        InputStream input = null;
        String secret = "";
        String registrationsDir = "";

        try {
            input = new FileInputStream(System.getProperty("user.dir") + "/webapps/resources/StoreRegistrationRequest.properties");
            prop.load(input);
            secret = prop.getProperty("sharedsecret");
            registrationsDir = prop.getProperty("registrationsdir");
        } catch (IOException ex) {
            ex.printStackTrace();
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        // Check to make sure that the shared secret in the properties file matches the one passsed as a parameter.
        if (!secretparam.equals(secret)) {
            // Return an error JSON response.
            return Response.status(200).entity(getResponse(false, "Thank you.")).build();
        }

        // TODO: Check a signature from the calling process to ensure that the sender signed something with the private key that curresponds with the sent public keuy.
        // In the signature is not valid, terminate.

        // TODO: Call a smart contract to make sure the registration request is sponsored.

        // Create a subdirectory of the respository directory with the same name as the public key.
        String fileLocation = registrationsDir + "/" + address + "/" + fileDetail.getFileName();
        String infoLocation = registrationsDir + "/" + address + "/info.json";
        try {
            File newFolder = new File(registrationsDir + "/" + address);
            boolean created = newFolder.mkdir();
            FileOutputStream out = new FileOutputStream(new File(fileLocation));
            int read = 0;
            byte[] bytes = new byte[1024];
            while ((read = uploadedInputStream.read(bytes)) != -1) {
                out.write(bytes, 0, read);
            }
            out.flush();
            out.close();

            // Create a JSON file containing the challenge phase.
            PrintWriter writer = new PrintWriter(infoLocation, "UTF-8");
            writer.println("{\"challenge\":\"" + challenge + "\"}");
            writer.close();

        } catch (IOException e) {
            e.printStackTrace();
        }

        if (new File(fileLocation).exists() && new File(infoLocation).exists()) {
            // Return a success JSON response.
            return Response.status(200).entity(getResponse(true, "The registration request data was successfully stored.")).build();
        }

        // Something went wrong (e.g., The files were not stored due to a permissions issue or some other reason.).
        return Response.status(200).entity(getResponse(false, "The registration request data was NOT successfully stored.")).build();

    }

    private String getResponse(Boolean success, String message) {
        org.json.JSONObject obj = new org.json.JSONObject();
        obj.put("success", success);
        obj.put("message", message);
        return obj.toString();
    }
}