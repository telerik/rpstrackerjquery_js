import "../shared/style-imports";
import "./active-issues.css";

import $ from "jquery";
import "bootstrap/dist/js/bootstrap";
import "@progress/kendo-ui/js/kendo.buttongroup";
import "@progress/kendo-ui/js/kendo.combobox";
import "@progress/kendo-ui/js/kendo.dataviz.chart";

import { DashboardPageModel } from "./dashboard-page-model";

const dashboardPageModel = new DashboardPageModel();
let comboboxAssignee = null;
let issuesChart = null;

dashboardPageModel.filter$.subscribe((filter) => {
  if (filter && filter.dateStart && filter.dateEnd) {
    const range = `${filter.dateStart.toDateString()} - ${filter.dateEnd.toDateString()}`;
    $("#spanFilteredDateRange").html(range);
  }
});

dashboardPageModel.statusCounts$.subscribe((results) => {
  if (results) {
    $("#statusCountsActiveItemsCount").text(results.activeItemsCount);
    $("#statusCountsClosedItemsCount").text(results.closedItemsCount);
    $("#statusCountsOpenItemsCount").text(results.openItemsCount);
    $("#statusCountsCloseRate").text(
      `${Math.floor(results.closeRate * 100) / 100}%`
    );
  }
});

dashboardPageModel.users$.subscribe((users) => {
  if (users && comboboxAssignee) {
    comboboxAssignee.dataSource.data(users);
  }
});

dashboardPageModel.dataForChart$.subscribe((data) => {
  // update chart
  if (data && issuesChart) {
    issuesChart.setOptions({
      categoryAxis: {
        categories: data.categories,
      },
      series: [
        {
          name: "Open",
          data: data.itemsOpenByMonth,
          color: "#CC3458",
          opacity: 0.7,
        },
        {
          name: "Closed",
          data: data.itemsClosedByMonth,
          color: "#35C473",
          opacity: 0.7,
        },
      ],
    });
  }
});

$(() => {
  const comboboxAssigneeOptions = {
    dataSource: [],
    dataTextField: "fullName",
    dataValueField: "id",
    open: () => dashboardPageModel.usersRequested(),
    change: (e) => {
      dashboardPageModel.selectedUserIdStr = e.sender.value();
      dashboardPageModel.userFilterValueChange();
    },
    template: `
      <div class="row" style="margin-left: 5px;">
          <img class="li-avatar rounded mx-auto d-block" src=#=avatar# />
          <span style="margin-left: 5px;">#= fullName #</span>
      </div>
    `,
  };

  comboboxAssignee = $("#inputAssignee")
    .kendoComboBox(comboboxAssigneeOptions)
    .data("kendoComboBox");

  $(".pt-range-filter-group").kendoButtonGroup();

  $(".pt-class-range-filter").click((e) => {
    const range = Number($(e.currentTarget).attr("data-range"));
    dashboardPageModel.onMonthRangeSelected(range);
  });

  issuesChart = $("#chart")
    .kendoChart({
      title: "All Issues",
      legend: {
        position: "bottom",
      },
      categoryAxis: {
        categories: [],
        baseUnit: "months",
        labels: {
          rotation: "auto",
        },
        majorGridLines: { visible: false },
      },
      seriesDefaults: {
        stack: true,
        type: "column",
        gap: 0.06,
      },
      series: [
        {
          name: "Open",
          data: [],
          color: "#CC3458",
          opacity: 0.7,
        },
        {
          name: "Closed",
          data: [],
          color: "#35C473",
          opacity: 0.7,
        },
      ],
      theme: "sass",
    })
    .data("kendoChart");
});

dashboardPageModel.refresh();
