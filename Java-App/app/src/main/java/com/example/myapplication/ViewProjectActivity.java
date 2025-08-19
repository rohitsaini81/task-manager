package com.example.myapplication;

import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class ViewProjectActivity extends AppCompatActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstance){
        super.onCreate(savedInstance);
        setContentView(R.layout.activity_tasks);
    }
}
