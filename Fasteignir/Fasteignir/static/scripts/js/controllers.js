var FasteignListi = angular.module('FasteignApp', ['ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping']);

FasteignListi.controller('FasteignListCtrl', function ($scope, $http, $timeout, uiGridConstants, uiGridGroupingConstants) {

    $scope.gridOptions = {};
    $scope.gridOptions.paginationPageSizes = [50, 100, 200];
    $scope.gridOptions.paginationPageSize = 100;
    $scope.gridOptions.enableColumnResizing = true;
    $scope.gridOptions.enableFiltering = true;
    $scope.gridOptions.enableGridMenu = true;
    $scope.gridOptions.showGridFooter = true;
    $scope.gridOptions.showColumnFooter = true;
    $scope.gridOptions.fastWatch = true;

    $scope.gridOptions.columnDefs = [
        { field: 'Tegund', displayName: 'Tegund' },
        {
            field: 'staerd', displayName: 'Stærð', width: 85,
            filters: [
                {
                    condition: uiGridConstants.filter.GREATER_THAN,
                    placeholder: 'stærra en'
                },
                {
                    condition: uiGridConstants.filter.LESS_THAN,
                    placeholder: 'minna en'
                }
            ]
        },
        {
            field: 'Herbergi', displayName: 'Herbergi',
            filters: [
                {
                    condition: uiGridConstants.filter.GREATER_THAN,
                    placeholder: 'stærra en'
                },
                {
                    condition: uiGridConstants.filter.LESS_THAN,
                    placeholder: 'minna en'
                }
            ]
        },
        { field: 'Heimilisfang', displayName: 'Heimilisfang', width: 130 },
        { field: 'byggingar_ar', displayName: 'Byggingarár', width: 130 },
        { field: 'skrad', displayName: 'Skráð á vef', width: 120, cellFilter: 'date:YYYY-MM-DD', filterCellFiltered: true, sortCellFiltered: true, type: 'date' },
        { field: 'Fasteignamat', displayName: 'Fasteignamat', width: 130 },
        { field: 'Brunabotamat', displayName: 'Brunabótamat', width: 140 },
        {
            field: 'Verd', displayName: 'Verð',
            filters: [
               {
                   condition: uiGridConstants.filter.GREATER_THAN,
                   placeholder: 'stærra en'
               },
               {
                   condition: uiGridConstants.filter.LESS_THAN,
                   placeholder: 'minna en'
               }
            ]
        },
        {
            field: 'Seld', displayName: 'Seld', width: 60, enableColumnMenu: false,
            filter: { type: uiGridConstants.filter.SELECT,
                selectOptions: [ { value: 'No', label: 'Nei' }, { value: 'Yes', label: 'Já' }]
                },
            cellFilter: 'SeldFilter'
        }
    ];

    var poller = function () {
        $http.get('/get').then(function (response) {
            if (response.status == 202) {
                $scope.loading = true;
            }
            else if (response.status == 200) {
                $scope.loading = false;
                $scope.gridOptions.data = response.data.houses;
            }
        }, function (response) {
            $scope.errorMsg = "Something went wrong";
        });
    }

    $scope.getData = function () {
        $scope.loading = true;
        $timeout(function () {
            poller();
        }, 20000);
    }

})
.filter('SeldFilter', function () {
    return function(input) {
        switch(input) {
            case 'Yes':
                return 'Já';
            case 'No':
                return 'Nei';
        }
    }
});