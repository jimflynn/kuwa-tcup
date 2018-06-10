package org.kuwa;

import javax.servlet.*;
import javax.servlet.http.HttpServlet;
import java.nio.file.*;
import java.io.*;
 
/**
 * @author Carlos Mondragon
 */
 
@SuppressWarnings("serial")
public class WatcherService extends HttpServlet
{
 
    public void init() throws ServletException
    {
        // Print out the working directory
        System.out.println("=======================================================");
        System.out.println("Working Directory = " + System.getProperty("user.dir"));
        System.out.println("=======================================================");
        // Set the path of the directory that contains the keys
        Path dir = Paths.get("/home/darshi/Kuwa/tcup/Registrar/Watcher/testWatch/");
        System.out.println(dir.toString());
        // Start the watching thread for new folders being created
        try {
            Thread watcher = new Thread(new Watch(dir, true));
            watcher.start();
        } catch(IOException e) {
            e.printStackTrace();
        }
    }
}
