package com.example.myapplication.models;

public class Project {
    private String _id;
    private String projectName;
    private String projectDescription;

    public Project(String id, String projectName, String projectDescription) {
        this._id = id;
        this.projectName = projectName;
        this.projectDescription = projectDescription;
    }

    public String getId() { return _id; }
    public String getName() { return projectName; }
    public String getDescription() { return projectDescription; }
}
