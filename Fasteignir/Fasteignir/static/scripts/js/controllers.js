var FasteignListi = angular.module('FasteignApp', ['ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping']);

FasteignListi.controller('FasteignListCtrl', function ($scope, $http, uiGridConstants, uiGridGroupingConstants) {

    $scope.gridOptions = {};
    $scope.gridOptions.enableColumnResizing = true;
    $scope.gridOptions.enableFiltering = true;
    $scope.gridOptions.enableGridMenu = true;
    $scope.gridOptions.showGridFooter = true;
    $scope.gridOptions.showColumnFooter = true;
    $scope.gridOptions.fastWatch = true;

    $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
        if (col.filters[0].term) {
            return 'header-filtered';
        } else {
            return '';
        }
    };

    $http.get("/get")
    .then(function (response) {
        $scope.gridOptions.data = response.data.houses;
        $scope.gridOptions.columnDefs = [
            { name: 'Tegund' },
            { name: 'Stærð', aggregationType: uiGridConstants.aggregationType.avg, treeAggregationType: uiGridGroupingConstants.aggregation.AVG },
            {
                name: 'Herbergi', aggregationType: uiGridConstants.aggregationType.avg, treeAggregationType: uiGridGroupingConstants.aggregation.AVG,
                filters: [
                    {
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than'
                    },
                    {
                        condition: uiGridConstants.filter.LESS_THAN,
                        placeholder: 'less than'
                    }],
                headerCellClass: $scope.highlightFilteredHeader
            },
            { name: 'Heimilisfang' },
            { name: 'Byggingar ár' },
            { name: 'Skráð á vef', cellFilter: 'date:YYYY-MM-DD', filterCellFiltered: true, sortCellFiltered: true, type: 'date' },
            { name: 'Fasteignamat' },
            { name: 'Brunabótamat' },
            { name: 'Verð' },
            {
                field: 'Seld', filter: {
                    term: '1',
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{ value: '1', label: 'Nei' }, { value: '2', label: 'Já' }]
                }
            },
        ];
    }, function (response) {
        $scope.errorMsg = "Something went wrong";
    });
});