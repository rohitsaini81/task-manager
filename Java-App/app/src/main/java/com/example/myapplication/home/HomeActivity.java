package com.example.myapplication.home;

import static com.example.myapplication.MainActivity.server_url;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.PopupMenu;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.ApiClient;
import com.example.myapplication.LoginActivity;
import com.example.myapplication.R;
import com.example.myapplication.adapters.ProjectAdapter;
import com.example.myapplication.models.Project;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class HomeActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        SharedPreferences sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE);
        String sessionId = sharedPreferences.getString("session_id", null);

        if (sessionId == null) {
            // Not logged in, redirect to login
            startActivity(new Intent(HomeActivity.this, LoginActivity.class));
            finish();
            return;
        }

        RecyclerView recyclerView = findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        new Thread(() -> {
            String response;
            try {
                // TODO: Pass sessionId in headers if API needs authentication
                response = ApiClient.GetRequest(server_url + "api/project/all");
            } catch (IOException e) {
                runOnUiThread(() ->
                        Toast.makeText(HomeActivity.this, "Network error: " + e.getMessage(), Toast.LENGTH_SHORT).show());
                return;
            }

            String finalResponse = response;
            runOnUiThread(() -> {
                if ("Error: 400".equals(finalResponse)) {
                    Toast.makeText(HomeActivity.this, "Invalid Credentials!", Toast.LENGTH_SHORT).show();
                } else {
                    // 👇 Now shows the actual API response
//                    Toast.makeText(HomeActivity.this, finalResponse, Toast.LENGTH_LONG).show();
                    // TODO: parse JSON and update recyclerView with adapter




                    try {
                        JSONObject jsonObject = new JSONObject(finalResponse);

                        // if data is inside "data"
                        JSONArray jsonArray = jsonObject.getJSONArray("projects");                        List<Project> projects = new ArrayList<>();


                        for (int i = 0; i < jsonArray.length(); i++) {
                            JSONObject obj = jsonArray.getJSONObject(i);
                            String id = obj.getString("_id");
                            String name = obj.getString("projectName");
                            String description = obj.optString("projectDescription", "");
                            projects.add(new Project(id, name, description));
                        }

                        Toast.makeText(HomeActivity.this, projects.get(0).getName(), Toast.LENGTH_SHORT).show();






                        recyclerView.setAdapter(new ProjectAdapter(projects));






                    } catch (JSONException e) {
                        Toast.makeText(HomeActivity.this, "Parse error: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                    }

                    }
            });
        }).start();
    }
}
