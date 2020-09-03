import "bootstrap/dist/css/bootstrap.css";
import '../styles.css';
import './active-issues.css';

import $ from "jquery";
import "bootstrap/dist/js/bootstrap";

import { DashboardPageModel } from './dashboard-page-model';

const dashboardPageModel = new DashboardPageModel();

dashboardPageModel.filter$.subscribe(filter => {
    if (filter && filter.dateStart && filter.dateEnd) {
        const range = `${filter.dateStart.toDateString()} - ${filter.dateEnd.toDateString()}`;
        $('#spanFilteredDateRange').html(range);
    }
});

dashboardPageModel.statusCounts$.subscribe(results => {
    if (results) {
        $('#statusCountsActiveItemsCount').text(results.activeItemsCount);
        $('#statusCountsClosedItemsCount').text(results.closedItemsCount);
        $('#statusCountsOpenItemsCount').text(results.openItemsCount);
        $('#statusCountsCloseRate').text(`${Math.floor(results.closeRate * 100) / 100}%`);
    }
});

$(() => {
    $('.pt-class-range-filter').click((e) => {
        const range = Number($(e.currentTarget).attr('data-range'));
        dashboardPageModel.onMonthRangeSelected(range);
    });
});


dashboardPageModel.refresh();

