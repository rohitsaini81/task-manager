package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {
//  static variables
    public static String server_url="http://192.168.1.25:3000/";


    EditText inputField;
    Button btnLogin, btnSignUp, btnViewProjects;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Set the layout for this activity
        setContentView(R.layout.activity_main);

        inputField = findViewById(R.id.inputField);
        btnLogin = findViewById(R.id.btnLogin);
        btnSignUp = findViewById(R.id.btnSignUp);
        btnViewProjects = findViewById(R.id.btnViewProjects);

        SharedPreferences sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE);
        String sessionId = sharedPreferences.getString("session_id", null);

        if (sessionId != null) {
            // User is logged in
            Toast.makeText(this,"You are Already Logged In",Toast.LENGTH_SHORT).show();
        } else {
            // Session expired or user not logged in
        }

//        // Set up click listeners

         btnLogin.setOnClickListener(v -> {
             Intent intent = new Intent(MainActivity.this, LoginActivity.class);
             intent.putExtra("username", "john_doe");
             startActivity(intent);
        });

         btnSignUp.setOnClickListener( v->{
             Intent intent = new Intent(MainActivity.this, SignUpActivity.class);
             startActivity(intent);

         });
         btnViewProjects.setOnClickListener(v->{
             Intent intent = new Intent(MainActivity.this, ViewProjectActivity.class);
             startActivity(intent);
         });




    }
}