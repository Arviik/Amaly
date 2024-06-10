package dev.esgi.javaclient.controller;

import dev.esgi.javaclient.model.*;
import dev.esgi.javaclient.rest.services.RestService;
import io.github.palexdev.materialfx.controls.*;
import io.github.palexdev.materialfx.controls.cell.MFXTableRowCell;
import io.github.palexdev.materialfx.filter.StringFilter;
import io.github.palexdev.materialfx.utils.others.FunctionalStringConverter;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import org.springframework.stereotype.Component;
import com.calendarfx.view.TimeField;

import java.net.URL;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.ResourceBundle;

@Component
public class BaseController implements Initializable {

    @FXML private Label resourceLabel;
    @FXML private MFXTextField resourceNameField;
    @FXML private MFXComboBox<ResourceType> resourceTypeField;
    @FXML private MFXTableView<Resource> resourceTable;
    @FXML private TextArea taskDetailsField;
    @FXML private MFXDatePicker taskEndsAtDateField;
    @FXML private TimeField taskEndsAtTimeField;
    @FXML private Label taskLabel;
    @FXML private MFXTextField taskNameField;
    @FXML private MFXComboBox<String> taskSelectThingToAdd;
    @FXML private MFXDatePicker taskStartsAtDateField;
    @FXML private TimeField taskStartsAtTimeField;
    @FXML private MFXTableView<Task> taskTable;
    @FXML private MFXComboBox<Object> taskThingToAdd;
    @FXML private MFXComboBox<Task> taskToAddTo;
    @FXML private MFXTextField typeTypeField;

    private final RestService<Assignment> assignmentRestService;
    private final RestService<Member> memberRestService;
    private final RestService<Resource> resourceRestService;
    private final RestService<ResourceType> resourceTypeRestService;
    private final RestService<Task> taskRestService;
    private final RestService<TaskResource> taskResourceRestService;

    private List<Member> memberList;
    private List<Resource> resourceList;

    public BaseController(RestService<Assignment> assignmentRestService,
                          RestService<Member> memberRestService,
                          RestService<Resource> resourceRestService,
                          RestService<ResourceType> resourceTypeRestService,
                          RestService<Task> taskRestService,
                          RestService<TaskResource> taskResourceRestService) {
        this.assignmentRestService = assignmentRestService;
        this.memberRestService = memberRestService;
        this.resourceRestService = resourceRestService;
        this.resourceTypeRestService = resourceTypeRestService;
        this.taskRestService = taskRestService;
        this.taskResourceRestService = taskResourceRestService;
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        initResource();
        initResourceType();
        initTask();
        initAddToTask();
    }

    private void initResource() {
        MFXTableColumn<Resource> nameColumn = new MFXTableColumn<>("Nom", true, Comparator.comparing(Resource::getName));
        MFXTableColumn<Resource> typeColumn = new MFXTableColumn<>("Type", true, Comparator.comparing(resource -> resourceTypeRestService.getById(resource.getResourceTypeId()).getType()));

        nameColumn.setRowCellFactory(resource -> new MFXTableRowCell<>(Resource::getName));
        typeColumn.setRowCellFactory(resource -> new MFXTableRowCell<>(resource1 -> resourceTypeRestService.getById(resource1.getResourceTypeId()).getType()));

        resourceTable.getTableColumns().add(nameColumn);
        resourceTable.getTableColumns().add(typeColumn);

        resourceTable.getFilters().add(new StringFilter<>("Nom", Resource::getName));
        resourceTable.getFilters().add(new StringFilter<>("Type", resource -> resourceTypeRestService.getById(resource.getResourceTypeId()).getType()));

        resourceList = List.of(resourceRestService.get());
        resourceTable.getItems().addAll(resourceList);
    }

    private void initResourceType() {
        resourceTypeField.getItems().addAll(resourceTypeRestService.get());
        resourceTypeField.setConverter(FunctionalStringConverter.to(resourceType -> (resourceType == null ? "" : String.valueOf(resourceType.getType()))));
    }

    private void initTask() {
        MFXTableColumn<Task> nameColumn = new MFXTableColumn<>("Nom", true, Comparator.comparing(Task::getName));
        MFXTableColumn<Task> detailsColumn = new MFXTableColumn<>("Détails", true, Comparator.comparing(Task::getDetails));
        MFXTableColumn<Task> startsAtColumn = new MFXTableColumn<>("Début", true, Comparator.comparing(Task::getStartsAt));
        MFXTableColumn<Task> endsAtColumn = new MFXTableColumn<>("Fin", true, Comparator.comparing(Task::getEndsAt));
        MFXTableColumn<Task> membersColumn = new MFXTableColumn<>("Membres", true, Comparator.comparing(this::getTaskMembers));
        MFXTableColumn<Task> resourceColumn = new MFXTableColumn<>("Ressources", true, Comparator.comparing(this::geTaskResources));

        nameColumn.setRowCellFactory(task -> new MFXTableRowCell<>(Task::getName));
        detailsColumn.setRowCellFactory(task -> new MFXTableRowCell<>(Task::getDetails));
        startsAtColumn.setRowCellFactory(task -> new MFXTableRowCell<>(Task::getStartsAt));
        endsAtColumn.setRowCellFactory(task -> new MFXTableRowCell<>(Task::getEndsAt));
        membersColumn.setRowCellFactory(task -> new MFXTableRowCell<>(this::getTaskMembers));
        resourceColumn.setRowCellFactory(task -> new MFXTableRowCell<>(this::geTaskResources));

        taskTable.getTableColumns().add(nameColumn);
        taskTable.getTableColumns().add(detailsColumn);
        taskTable.getTableColumns().add(startsAtColumn);
        taskTable.getTableColumns().add(endsAtColumn);
        taskTable.getTableColumns().add(membersColumn);
        taskTable.getTableColumns().add(resourceColumn);

        taskTable.getFilters().add(new StringFilter<>("Nom", Task::getName));
        taskTable.getFilters().add(new StringFilter<>("Détails", Task::getDetails));
        taskTable.getFilters().add(new StringFilter<>("Début", task -> task.getStartsAt().toString()));
        taskTable.getFilters().add(new StringFilter<>("Fin", task -> task.getEndsAt().toString()));
        taskTable.getFilters().add(new StringFilter<>("Membres", this::getTaskMembers));
        taskTable.getFilters().add(new StringFilter<>("Ressources", this::geTaskResources));

        List<Task> taskList = List.of(taskRestService.get());
        taskTable.getItems().addAll(taskList);

        taskToAddTo.getItems().addAll(taskList);
        taskToAddTo.setConverter(FunctionalStringConverter.to(task -> (task == null) ? "" : String.valueOf(task.getName())));
    }

    private void initAddToTask() {
        taskSelectThingToAdd.getItems().addAll("Member", "Ressource");
    }

    @FXML
    void onThingToAddChange() {
        taskThingToAdd.getItems().clear();
        String thingToAdd = taskSelectThingToAdd.getValue();
        if (thingToAdd.equals("Member")) {
            taskThingToAdd.getItems().addAll(memberList);
            taskThingToAdd.setConverter(FunctionalStringConverter.to(object -> (object == null ? "" : "test Member")));
        } else if (thingToAdd.equals("Ressource")) {
            taskThingToAdd.getItems().addAll(resourceList);
            taskThingToAdd.setConverter(FunctionalStringConverter.to(object -> (object == null ? "" : "test Resource")));
        }
    }

    @FXML
    void onAddToTaskSubmit() {

    }

    @FXML
    void onResourceSubmit() {
        Resource newResource = resourceRestService.post(new Resource(
                0,
                resourceNameField.getText(),
                resourceTypeField.getSelectedItem().getId()
        ));

        resourceTable.getItems().add(newResource);
        resourceNameField.clear();
        resourceTypeField.clear();
    }

    @FXML
    void onTaskSubmit() {
        Task newTask = taskRestService.post(new Task(
                0,
                taskNameField.getText(),
                taskDetailsField.getText(),
                LocalDateTime.of(taskStartsAtDateField.getValue(), taskStartsAtTimeField.getValue()),
                LocalDateTime.of(taskEndsAtDateField.getValue(), taskEndsAtTimeField.getValue())
        ));

        taskTable.getItems().add(newTask);
        taskToAddTo.getItems().add(newTask);
        taskNameField.clear();
        taskDetailsField.clear();
        taskStartsAtDateField.clear();
        taskStartsAtTimeField.setValue(LocalTime.now());
        taskEndsAtDateField.clear();
        taskEndsAtTimeField.setValue(LocalTime.now());
    }

    @FXML
    void onTypeSubmit() {
        ResourceType newResourceType = resourceTypeRestService.post(new ResourceType(
                0,
                typeTypeField.getText()
        ));

        resourceTypeField.getItems().add(newResourceType);
        typeTypeField.clear();
    }

    private String getTaskMembers(Task task) {
        Assignment[] assignments = assignmentRestService.get();
        StringBuilder result = new StringBuilder();

        for (Assignment assignment : assignments) {
            if (assignment.getTaskId() == task.getId()) {
                result.append(memberRestService.getById(assignment.getMemberId()).getName());
                result.append(", ");
            }
        }

        if (result.length() - 2 > 0) {
            result.delete(result.length() - 2, result.length());
            result.append(";");
        }

        return new String(result);
    }

    private String geTaskResources(Task task) {
        TaskResource[] taskResources = taskResourceRestService.get();
        StringBuilder result = new StringBuilder();

        for (TaskResource taskResource : taskResources) {
            if (taskResource.getTaskId() == task.getId()) {
                result.append(resourceRestService.getById(taskResource.getResourceId()).getName());
                result.append(", ");
            }
        }

        if (result.length() - 2 > 0) {
            result.delete(result.length() - 2, result.length());
            result.append(";");
        }

        return new String(result);
    }

    /*@SneakyThrows
    private <T> void initTable(MFXTableView<T> table, Class<T> classType) {
        Method[] methods = classType.getMethods();
        for (Method method : methods) {
            String methodName = method.getName();

            if (methodName.contains("get") && !methodName.contains("id")) {
                String columnName = methodName.substring(3);

                MFXTableColumn<T> column = new MFXTableColumn<>(columnName, true, Comparator.comparing(method::invoke));
                column.setRowCellFactory(objectClass -> new MFXTableRowCell<>(method::invoke));
                table.getTableColumns().add(column);
                table.getFilters().add(new StringFilter<>(columnName, method::invoke));
            }
        }
    }*/
}
