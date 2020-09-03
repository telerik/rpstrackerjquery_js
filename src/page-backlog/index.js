import "bootstrap/dist/css/bootstrap.css";
import "../styles.css";
import "./backlog.css";

import $ from "jquery";
import "bootstrap/dist/js/bootstrap";

import { ItemType } from "../core/constants";
import { getIndicatorClass } from "../shared/helpers/priority-styling";
import { BacklogPageModel } from "./backlog-page-model";
import { pushUrl, getQueryParameter } from "../utils/url";

const reqPreset = getQueryParameter("preset");
const backlogPageModel = new BacklogPageModel(reqPreset);

backlogPageModel.items$.subscribe((items) => {
  $("#itemsTableBody").html(renderTableRows(items));
});

function getIndicatorImage(item) {
  return ItemType.imageResFromType(item.type);
}

function renderTableRows(items) {
  return items.map((i) => renderTableRow(i)).join();
}
function renderTableRow(item) {
  return `
    <tr class="pt-table-row" data-id="${item.id}">
        <td><img src="${getIndicatorImage(item)}" class="backlog-icon"></td>
        <td><img src="${item.assignee.avatar}"
                class="li-avatar rounded mx-auto d-block" /></td>
        <td><span class="li-title">${item.title}</span></td>
        <td><span class="${"badge " + getIndicatorClass(item.priority)}">${
    item.priority
  }</span></td>
        <td><span class="li-estimate">${item.estimate}</span></td>
        <td><span class="li-date">${item.dateCreated.toDateString()}</span></td>
    </tr>
    `;
}

$(() => {
  const newItemTypeSelectObj = $("#newItemType");
  $.each(backlogPageModel.itemTypesProvider, (key, value) => {
    newItemTypeSelectObj.append(
      $("<option></option>").attr("value", value).text(value)
    );
  });

  $(".btn-backlog-filter").click((e) => {
    const selPreset = $(e.currentTarget).attr("data-preset");
    pushUrl("", "page-backlog/backlog.html", "?preset=" + selPreset);
    backlogPageModel.currentPreset = selPreset;
    backlogPageModel.refresh();
  });

  $("#btnAddItemSave").click(() => {
    const newTitle = $("#newItemTitle").val();
    const newDescription = $("#newItemDescription").val();
    const newItemType = $("#newItemType").val();
    const newItem = {
      title: newTitle,
      description: newDescription,
      typeStr: newItemType,
    };
    backlogPageModel.onAddSave(newItem);
  });

  $(document).on("click", "#itemsTableBody tr", (e) => {
    const itemId = $(e.currentTarget).attr("data-id");
    window.location.href = `/page-detail/detail.html?screen=details&itemId=${itemId}`;
  });
});

backlogPageModel.refresh();
