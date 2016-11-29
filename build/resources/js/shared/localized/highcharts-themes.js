/* Serve theme for pie chart */
var startingColors = [],
    hoverColors = [],
    placeholderColors = [],
    placeholderData = [];

var pieChartLegendLength = $('[data-widget-type=pie-chart]').find('[data-widget-role=pie-chart-legend]').children().length;

if (pieChartLegendLength == 0) {
    pieChartLegendLength = $('[data-widget-type=pie-chart-placeholder]').find('[data-widget-role=pie-chart-legend]').children().length;
}

Highcharts.LegendLength = pieChartLegendLength;

if ($('body').attr('class') === 'bb') {
    switch (pieChartLegendLength) {
        case 13:
            startingColors = ['#189bd7', '#23aece', '#54bca2', '#8dc73f', '#bdd633', '#e0e324', '#f7bd1b', '#f4a61d', '#f47b3e', '#ee6326', '#ce2e71', '#882784', '#979797'];
            hoverColors = ['#86bbe5', '#8cc8de', '#9dd3c3', '#bada89', '#d6e489', '#ecec89', '#fbd47f', '#f9c779', '#f9ac81', '#f59e70', '#dd859e', '#ac77aa', '#cbcbcb'];
            placeholderColors = ['#74c3e7', '#7bcee2', '#98d7c7', '#bbdd8c', '#d7e684', '#ecee7c', '#fad776', '#f8ca77', '#f8b08b', '#f5a17d', '#e282aa', '#b87db5', '#c1c1c1'];
            break;
        case 12:
            startingColors = ['#189bd7', '#23aece', '#54bca2', '#8dc73f', '#bdd633', '#e0e324', '#f7bd1b', '#f47b3e', '#ee6326', '#ce2e71', '#882784', '#979797'];
            hoverColors = ['#86bbe5', '#8cc8de', '#9dd3c3', '#bada89', '#d6e489', '#ecec89', '#fbd47f', '#f9ac81', '#f59e70', '#dd859e', '#ac77aa', '#cbcbcb'];
            placeholderColors = ['#74c3e7', '#7bcee2', '#98d7c7', '#bbdd8c', '#d7e684', '#ecee7c', '#fad776', '#f8b08b', '#f5a17d', '#e282aa', '#b87db5', '#c1c1c1'];
            break;
        case 11:
            startingColors = ['#189bd7', '#54bca2', '#8dc73f', '#bdd633', '#e0e324', '#f7bd1b', '#f47b3e', '#ee6326', '#ce2e71', '#882784', '#979797'];
            hoverColors = ['#86bbe5', '#9dd3c3', '#bada89', '#d6e489', '#ecec89', '#fbd47f', '#f9ac81', '#f59e70', '#dd859e', '#ac77aa', '#cbcbcb'];
            placeholderColors = ['#74c3e7', '#98d7c7', '#bbdd8c', '#d7e684', '#ecee7c', '#fad776', '#f8b08b', '#f5a17d', '#e282aa', '#b87db5', '#c1c1c1'];
            break;
        case 10:
            startingColors = ['#189bd7', '#54bca2', '#8dc73f', '#bdd633', '#e0e324', '#f4a61d', '#ee6326', '#ce2e71', '#882784', '#979797'];
            hoverColors = ['#86bbe5', '#9dd3c3', '#bada89', '#d6e489', '#ecec89', '#f9c779', '#f59e70', '#dd859e', '#ac77aa', '#cbcbcb'];
            placeholderColors = ['#74c3e7', '#98d7c7', '#bbdd8c', '#d7e684', '#ecee7c', '#f8ca77', '#f5a17d', '#e282aa', '#b87db5', '#c1c1c1'];
            break;
        case 9:
            startingColors = ['#189bd7', '#54bca2', '#8dc73f', '#e0e324', '#f4a61d', '#ee6326', '#ce2e71', '#882784', '#979797'];
            hoverColors = ['#86bbe5', '#9dd3c3', '#bada89', '#ecec89', '#f9c779', '#f59e70', '#dd859e', '#ac77aa', '#cbcbcb'];
            placeholderColors = ['#74c3e7', '#98d7c7', '#bbdd8c', '#ecee7c', '#f8ca77', '#f5a17d', '#e282aa', '#b87db5', '#c1c1c1'];
            break;
        case 8: //1, 3, 4, 6, 8, 10, 11, 13
            startingColors = ['#189bd7', '#54bca2', '#8dc73f', '#e0e324', '#f4a61d', '#ee6326', '#ce2e71', '#979797'];
            hoverColors = ['#86bbe5', '#9dd3c3', '#bada89', '#ecec89', '#f9c779', '#f59e70', '#dd859e', '#cbcbcb'];
            placeholderColors = ['#74c3e7', '#98d7c7', '#bbdd8c', '#ecee7c', '#f8ca77', '#f5a17d', '#e282aa', '#c1c1c1'];
            break;
        case 7:
            startingColors = ['#189bd7', '#54bca2', '#8dc73f', '#f7bd1b', '#ee6326', '#ce2e71', '#979797' ];
            hoverColors = ['#86bbe5', '#9dd3c3', '#bada89', '#fbd47f', '#f59e70', '#dd859e', '#cbcbcb' ];
            placeholderColors = ['#74c3e7', '#98d7c7', '#bbdd8c', '#fad776', '#f5a17d', '#e282aa', '#c1c1c1'];
            break;
        default:
            startingColors = ['#189bd7', '#8dc73f', '#f7bd1b', '#ee6326', '#ce2e71', '#979797' ];
            hoverColors = ['#86bbe5', '#bada89', '#fbd47f', '#f59e70', '#dd859e', '#cbcbcb' ];
            placeholderColors = ['#74c3e7', '#bbdd8c', '#fad776', '#f5a17d', '#e282aa', '#c1c1c1'];
            break;
    };

    Highcharts.pieTheme = {
        colors: startingColors,
        hoverColors: hoverColors
    };

    Highcharts.borderRadiusStyle = 5;

    Highcharts.piePlaceholerTheme = {
        colors: placeholderColors
    };

    /* Serve theme for column chart */
    Highcharts.columnTheme = {
        xAxis: {
            labels: {
                style: {
                    color: '#455560',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px'
                }
            },
            lineColor: '#a5a5a5'
        },
        yAxis: {
            labels: {
                style: {
                    color: '#455560',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px'
                }
            },
            lineColor: '#a5a5a5',
        },
        tooltip: {
            style: {
                color: '#189bd7',
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px'
            }
        },
        plotOptions: {
            series: { 
                color: '#189bd7'
            },
            column: {
                dataLabels: {
                    style: {
                        color: '#189bd7',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '14px'
                    }
                }
            }
        },

        //Special colors
        labelColor: '#0261ab',
        inactiveColor: '#d6d6d6'
    };
} else {
    switch (pieChartLegendLength) {
        case 13:
            startingColors = ['#16669e', '#218ead', '#0ca3aa', '#3aba91', '#8cce54', '#bfe25b', '#e8e83a', '#f9d849', '#ffbf07', '#ff9e00', '#ff7f00', '#f4608c', '#979797'];
            hoverColors = ['#8bb2cf', '#92c7d5', '#8dd1d4', '#9fdbc8', '#bbe19c', '#d3e99e', '#efe98b', '#fee584', '#feda8d', '#fecd92', '#fdbe90', '#fab0c4', '#dedede'];
            placeholderColors = ['#73a3c5', '#7abbce', '#6dc8cc', '#89d6bd', '#bae298', '#d9ee9d', '#f1f189', '#fbe892', '#ffd96a', '#ffc566', '#ffb266', '#f8a0ba', '#c1c1c1'];
            break;
        case 12:
            startingColors = ['#16669e', '#218ead', '#0ca3aa', '#3aba91', '#8cce54', '#bfe25b', '#e8e83a', '#f9d849', '#ffbf07', '#ff9e00', '#f4608c', '#979797'];
            hoverColors = ['#8bb2cf', '#92c7d5', '#8dd1d4', '#9fdbc8', '#bbe19c', '#d3e99e', '#efe98b', '#fee584', '#feda8d', '#fecd92', '#fab0c4', '#dedede'];
            placeholderColors = ['#73a3c5', '#7abbce', '#6dc8cc', '#89d6bd', '#bae298', '#d9ee9d', '#f1f189', '#fbe892', '#ffd96a', '#ffc566', '#f8a0ba', '#c1c1c1'];
            break;
        case 11:
            startingColors = ['#16669e', '#218ead', '#0ca3aa', '#3aba91', '#8cce54', '#bfe25b', '#f9d849', '#ffbf07', '#ff9e00', '#f4608c', '#979797'];
            hoverColors = ['#8bb2cf', '#92c7d5', '#8dd1d4', '#9fdbc8', '#bbe19c', '#d3e99e', '#fee584', '#feda8d', '#fecd92', '#fab0c4', '#dedede'];
            placeholderColors = ['#73a3c5', '#7abbce', '#6dc8cc', '#89d6bd', '#bae298', '#d9ee9d', '#fbe892', '#ffd96a', '#ffc566', '#f8a0ba', '#c1c1c1'];
            break;
        case 10:
            startingColors = ['#16669e', '#218ead', '#3aba91', '#8cce54', '#bfe25b', '#f9d849', '#ffbf07', '#ff9e00', '#f4608c', '#979797'];
            hoverColors = ['#8bb2cf', '#92c7d5', '#9fdbc8', '#bbe19c', '#d3e99e', '#fee584', '#feda8d', '#fecd92', '#fab0c4', '#dedede'];
            placeholderColors = ['#73a3c5', '#7abbce', '#89d6bd', '#bae298', '#d9ee9d', '#fbe892', '#ffd96a', '#ffc566', '#f8a0ba', '#c1c1c1'];
            break;
        case 9:
            startingColors = ['#16669e', '#218ead', '#3aba91', '#bfe25b', '#f9d849', '#ffbf07', '#ff9e00', '#f4608c', '#979797'];
            hoverColors = ['#8bb2cf', '#92c7d5', '#9fdbc8', '#d3e99e', '#fee584', '#feda8d', '#fecd92', '#fab0c4', '#dedede'];
            placeholderColors = ['#73a3c5', '#7abbce', '#89d6bd', '#d9ee9d', '#fbe892', '#ffd96a', '#ffc566', '#f8a0ba', '#c1c1c1'];
            break;
        case 8:
            startingColors = ['#16669e', '#218ead', '#3aba91', '#bfe25b', '#f9d849', '#ff9e00', '#f4608c', '#979797'];
            hoverColors = ['#8bb2cf', '#92c7d5', '#9fdbc8', '#d3e99e', '#fee584', '#fecd92', '#fab0c4', '#dedede'];
            placeholderColors = ['#73a3c5', '#7abbce', '#89d6bd', '#d9ee9d', '#fbe892', '#ffc566', '#f8a0ba', '#c1c1c1'];
            break;
        case 7:
            startingColors = ['#16669e', '#3aba91', '#bfe25b', '#f9d849', '#ff9e00', '#f4608c', '#979797'];
            hoverColors = ['#8bb2cf', '#9fdbc8', '#d3e99e', '#fee584', '#fecd92', '#fab0c4', '#dedede'];
            placeholderColors = ['#73a3c5', '#7abbce', '#d9ee9d', '#fbe892', '#ffc566', '#f8a0ba', '#c1c1c1'];
            break;
        default:
            startingColors = ['#16669e', '#8cce54', '#f9d849', '#ff9e00', '#f4608c', '#979797'];
            hoverColors = ['#8bb2cf', '#bbe19c', '#fee584', '#fecd92', '#fab0c4', '#dedede'];
            placeholderColors = ['#73a3c5', '#bae298', '#fbe892', '#ffc566', '#f8a0ba', '#c1c1c1'];
            break;
    };
    Highcharts.pieTheme = {
        colors: startingColors,
        hoverColors: hoverColors
    };

    Highcharts.borderRadiusStyle = 0;


    Highcharts.piePlaceholerTheme = {
        colors: placeholderColors
    };

    /* Serve theme for column chart */
    Highcharts.columnTheme = {
        xAxis: {
            labels: {
                style: {
                    color: '#455560',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px'
                }
            },
            lineColor: '#a5a5a5'
        },
        yAxis: {
            labels: {
                style: {
                    color: '#455560',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px'
                }
            },
            lineColor: '#a5a5a5',
        },
        tooltip: {
            style: {
                color: '#679ec7',
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px'
            }
        },
        plotOptions: {
            series: {
                color: '#679ec7'
            },
            column: {
                dataLabels: {
                    style: {
                        color: '#679ec7',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '14px'
                    }
                }
            }
        },

        //Special colors
        labelColor: '#015ea2',
        inactiveColor: '#d6d6d6'
    };
}