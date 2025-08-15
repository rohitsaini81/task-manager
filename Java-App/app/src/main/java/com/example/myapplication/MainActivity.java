package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.PopupMenu;
import android.widget.PopupWindow;
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
// popup test ----->
        final PopupMenu popupMenu= new PopupMenu(this,btnViewProjects);
        popupMenu.getMenu().add(Menu.NONE,0,0,"turn on internet");
        popupMenu.getMenu().add(Menu.NONE,1,1,"turn on wifi");

        LayoutInflater inflater = (LayoutInflater) getSystemService(LAYOUT_INFLATER_SERVICE);
        View popupView = inflater.inflate(R.layout.popupmenu, null);

// Width, height
        int width = LinearLayout.LayoutParams.WRAP_CONTENT;
        int height = LinearLayout.LayoutParams.WRAP_CONTENT;
        DisplayMetrics displayMetrics = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
        int screenHeight = displayMetrics.heightPixels;

// Calculate popup height as 60% of screen height (change to 0.8f for 80%)
        int popupHeight = (int) (screenHeight * 0.6f);
// Focusable so taps outside will dismiss
        boolean focusable = true;

        PopupWindow popupWindow = new PopupWindow(popupView, LinearLayout.LayoutParams.MATCH_PARENT, popupHeight, focusable);
//        PopupWindow popupWindow = new PopupWindow(popupView, width, height, focusable);

// Show the popup at the center of the root layout


// Close button inside popup
        ImageButton closeBtn = popupView.findViewById(R.id.close_popup_btn);
        closeBtn.setOnClickListener(v -> popupWindow.dismiss());







        //  end function
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
             popupWindow.showAtLocation(findViewById(android.R.id.content), Gravity.BOTTOM, 0, 0);

//             popupMenu.show();
//             Intent intent = new Intent(MainActivity.this, ViewProjectActivity.class);
//             startActivity(intent);
         });




    }
}