package com.example.myapplication.adapters;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.R;
import com.example.myapplication.home.TaskActivity;
import com.example.myapplication.models.Project;

import java.util.List;

public class ProjectAdapter extends RecyclerView.Adapter<ProjectAdapter.ProjectViewHolder> {

    private List<Project> projectList;

    public ProjectAdapter(List<Project> projectList) {
        this.projectList = projectList;
    }

    @NonNull
    @Override
    public ProjectViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_project, parent, false);
        return new ProjectViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ProjectViewHolder holder, int position) {
        Project project = projectList.get(position);

        holder.projectName.setText(project.getName());
        holder.projectDescription.setText(project.getDescription());

        // 👇 Row click → toast project id
        holder.itemView.setOnClickListener(v ->
                Toast.makeText(v.getContext(),
                        "Project ID: " + project.getName(),
                        Toast.LENGTH_SHORT).show()
        );
        holder.itemView.setOnClickListener(v -> {
            Context context = v.getContext();
            Intent intent = new Intent(context, TaskActivity.class);
            intent.putExtra("project_id", project.getId()); // 👈 pass the id
            context.startActivity(intent);
        });




        // 👇 3-dots click → toast project id
        holder.optionsButton.setOnClickListener(v ->
                Toast.makeText(v.getContext(),
                        "Options clicked for ID: " + project.getId(),
                        Toast.LENGTH_SHORT).show()
        );
    }


    @Override
    public int getItemCount() {
        return projectList.size();
    }

    static class ProjectViewHolder extends RecyclerView.ViewHolder {
        TextView projectName, projectDescription;
        ImageButton optionsButton;

        public ProjectViewHolder(@NonNull View itemView) {
            super(itemView);
            projectName = itemView.findViewById(R.id.projectName);
            projectDescription = itemView.findViewById(R.id.projectDescription);
            optionsButton = itemView.findViewById(R.id.optionsButton);
        }
    }
}
