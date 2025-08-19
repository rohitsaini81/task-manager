package com.example.myapplication.home;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.example.myapplication.R;

public class TaskActivity extends AppCompatActivity {
    protected void onCreate( Bundle savedInstance){
        super.onCreate(savedInstance);
        setContentView(R.layout.activity_tasks);
    }
    private void goBack() {
        // Works like hardware back button
//        getOnBackPressedDispatcher().onBackPressed();
//        super.onBackPressed();
//        finish(); // closes current activity, returns to previous one instantly
//        startActivity(new Intent(TaskActivity.this, HomeActivity.class));
        getOnBackPressedDispatcher().onBackPressed();

    }

}
