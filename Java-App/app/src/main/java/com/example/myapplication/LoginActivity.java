package com.example.myapplication;

import static com.example.myapplication.MainActivity.server_url;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Switch;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.io.IOException;
import java.util.Arrays;

public class LoginActivity extends AppCompatActivity {
    private Button backbtn,loginBtn;
    private EditText phone,password;
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        backbtn= findViewById(R.id.backbtn);
        loginBtn= findViewById(R.id.buttonLogin);

        phone = findViewById(R.id.editTextPhone);
        password = findViewById(R.id.editTextTextPassword);


        backbtn.setOnClickListener(v->{
            Intent intent = new Intent(LoginActivity.this, MainActivity.class);
            startActivity(intent);
        });


        loginBtn.setOnClickListener(v -> {
            if (phone == null || password == null) {
                Toast.makeText(this, "Something went wrong. Please try again.", Toast.LENGTH_SHORT).show();
                return;
            }

            String phoneNumber = phone.getText().toString().trim();
            String userPasswd = password.getText().toString();

            if (phoneNumber.isEmpty() || !phoneNumber.matches("\\d{9,10}")) {
                Toast.makeText(this, "Please enter a valid 9 or 10-digit phone number.", Toast.LENGTH_SHORT).show();
            } else if (userPasswd.isEmpty() || userPasswd.length() < 6 || userPasswd.length() > 16) {
                Toast.makeText(this, "Password length must be between 6 to 16 characters.", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Please Wait! " + phoneNumber, Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(LoginActivity.this, ViewProjectActivity.class);
                startActivity(intent);
                new Thread(() -> {
                    String response = null;
                    response = ApiClient.postLogin("+91"+phoneNumber,userPasswd,server_url+"api/auth/login");

                    String finalResponse = response;


                    runOnUiThread(() -> {
                        if(finalResponse.equals("Error: 400")){
                            Toast.makeText(LoginActivity.this,"Invalid Credentials !",Toast.LENGTH_SHORT).show();

                        }else{
                            String sessionId = finalResponse.split(":")[1].toString().replace("\"", "");//                    SharedPreferences sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE);

                            SharedPreferences sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE);
                            SharedPreferences.Editor editor = sharedPreferences.edit();
                            editor.putString("session_id", sessionId); // could be token or session cookie
                            editor.apply(); // or commit()

                            Toast.makeText(LoginActivity.this, finalResponse, Toast.LENGTH_LONG).show();
//                            Intent intent = new Intent(LoginActivity.this, ViewProjectActivity.class);
//                            startActivity(intent);
                        }
                    });

                });
//                        .start();

            }
        });




    }



    }
