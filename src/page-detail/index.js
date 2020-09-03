import "bootstrap/dist/css/bootstrap.css";
import "../styles.css";

import $ from "jquery";
import "bootstrap/dist/js/bootstrap";

import { pushUrl, getQueryParameter } from "../utils/url";
import { DetailPageModel } from "./detail-page-model";
import { renderScreenDetails } from "./screens/details-screen";
import { DetailsScreenModel } from "./screens/details-screen-model";
import { TasksScreenModel } from "./screens/tasks-screen-model";
import { renderScreenTasks } from "./screens/tasks-screen";
import { ChitchatScreenModel } from "./screens/chitchat-screen-model";
import { renderScreenChitchat } from "./screens/chitchat-screen";

const reqScreen = getQueryParameter("screen");
const reqItemId = Number(getQueryParameter("itemId"));
const detailPageModel = new DetailPageModel(reqScreen, reqItemId);

function resetAllScreens() {
  $("#detailsScreenContainer").empty();
  $("#tasksScreenContainer").empty();
  $("#chitchatScreenContainer").empty();
}

function createScreenDetails(detailPageModel) {
  const modelProps = {
    item: detailPageModel.item$.value,
    users$: detailPageModel.users$,
    itemSaved: (item) => detailPageModel.onItemSaved(item),
    usersRequested: () => detailPageModel.onUsersRequested(),
  };

  const detailsScreenModel = new DetailsScreenModel(modelProps);

  renderScreenDetails(detailsScreenModel);
}

function createScreenTasks(detailPageModel) {
  const modelProps = {
    tasks$: detailPageModel.tasks$,
    addNewTask: (newTask) => detailPageModel.onAddNewTask(newTask),
    updateTask: (taskUpdate) => detailPageModel.onUpdateTask(taskUpdate),
  };

  const tasksScreenModel = new TasksScreenModel(modelProps);

  renderScreenTasks(tasksScreenModel);
}

function createScreenChitchat(detailPageModel) {
  const modelProps = {
    comments$: detailPageModel.comments$,
    currentUser: detailPageModel.currentUser,
    addNewComment: (newComment) => detailPageModel.onAddNewComment(newComment),
  };

  const chitchatScreenModel = new ChitchatScreenModel(modelProps);

  renderScreenChitchat(chitchatScreenModel);
}

detailPageModel.item$.subscribe((item) => {
  if (item) {
    renderPageChanges(item);
    resetAllScreens();
    switch (detailPageModel.currentScreen) {
      case "details":
        createScreenDetails(detailPageModel);
        break;
      case "tasks":
        createScreenTasks(detailPageModel);
        break;
      case "chitchat":
        createScreenChitchat(detailPageModel);
        break;
      default:
        createScreenDetails(detailPageModel);
    }
  }
});

$(() => {
  $(".btn-screen-switch").click((e) => {
    const selScreen = $(e.currentTarget).attr("data-screen");
    pushUrl(
      "",
      "page-detail/detail.html",
      `?screen=${selScreen}&itemId=${detailPageModel.itemId}`
    );
    detailPageModel.currentScreen = selScreen;
    detailPageModel.refresh();
  });
});

function renderPageChanges(item) {
  $("#itemTitle").text(item.title);
}

detailPageModel.refresh();
