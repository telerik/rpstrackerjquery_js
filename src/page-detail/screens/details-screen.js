import "./details-screen.css";

import $ from "jquery";

let detailsScreenModel = undefined;

$(document).on("keyup", ".pt-text-field", (e) => {
  //update form model/
  const fieldObj = $(e.currentTarget);
  const formFieldName = fieldObj.attr("name");
  detailsScreenModel.itemForm[formFieldName] = fieldObj.val();
});

$(document).on("blur", ".pt-text-field", (e) => {
  //save changes
  detailsScreenModel.notifyUpdateItem();
});

$(document).on("click", "#btnAssigneeModal", () => {
  detailsScreenModel.onUsersRequested();
});

$(document).on("click", ".pt-assignee-item", (e) => {
  const selUserId = Number($(e.currentTarget).attr("data-user-id"));
  detailsScreenModel.selectUserById(selUserId);
});

function onFieldChange(e) {
  const fieldObj = $(e.currentTarget);
  const fieldName = fieldObj.attr("name");
  detailsScreenModel.itemForm[fieldName] = fieldObj.val();
}

function onNonTextFieldChange(e) {
  onFieldChange(e);
  detailsScreenModel.notifyUpdateItem();
}

export function renderScreenDetails(model) {
  detailsScreenModel = model;

  detailsScreenModel.props.users$.subscribe((users) => {
    if (users.length > 0) {
      renderAssignees(users);
    }
  });

  const detailsTemplate = $("#detailsTemplate").html();
  const renderedHtml = detailsTemplate
    .replace(/{{title}}/gi, detailsScreenModel.itemForm.title)
    .replace(/{{description}}/gi, detailsScreenModel.itemForm.description)
    .replace(/{{assigneeName}}/gi, detailsScreenModel.itemForm.assigneeName);

  $("#detailsScreenContainer").html(renderedHtml);
  $("#imgAssigneeAvatar").attr(
    "src",
    detailsScreenModel.selectedAssignee.avatar
  );

  const selectItemTypeObj = $("#selItemType");
  $.each(detailsScreenModel.itemTypesProvider, (key, value) => {
    selectItemTypeObj.append(
      $("<option></option>").attr("value", value).text(value)
    );
  });
  selectItemTypeObj
    .val(detailsScreenModel.itemForm.typeStr)
    .change(onNonTextFieldChange);

  const selectStatusObj = $("#selStatus");
  $.each(detailsScreenModel.statusesProvider, (key, value) => {
    selectStatusObj.append(
      $("<option></option>").attr("value", value).text(value)
    );
  });
  selectStatusObj
    .val(detailsScreenModel.itemForm.statusStr)
    .change(onNonTextFieldChange);

  const selectPriorityObj = $("#selPriority");
  $.each(detailsScreenModel.prioritiesProvider, (key, value) => {
    selectPriorityObj.append(
      $("<option></option>").attr("value", value).text(value)
    );
  });
  selectPriorityObj
    .val(detailsScreenModel.itemForm.priorityStr)
    .change(onNonTextFieldChange);

  const inputEstimateObj = $("#inputEstimate");
  inputEstimateObj
    .val(detailsScreenModel.itemForm.estimate)
    .change(onNonTextFieldChange);
}

export function renderAssignees(users) {
  const listAssigneesObj = $("#listAssignees").empty();
  $.each(users, (key, u) => {
    listAssigneesObj.append(
      $(
        `
            <li class="list-group-item d-flex justify-content-between align-items-center pt-assignee-item" data-user-id="${u.id}" data-dismiss="modal">
                <span>${u.fullName}</span>
                <span class="badge ">
                    <img src="${u.avatar}" class="li-avatar rounded mx-auto d-block" />
                </span>
            </li>
            `
      )
    );
  });
}
