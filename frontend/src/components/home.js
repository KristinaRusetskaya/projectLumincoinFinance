export class Home {
    constructor() {
        this.initFirstDiagram();
        this.initSecondDiagram();
        this.buttonHomeElement = document.getElementById("button-home");
        this.buttonHomeElement.classList.add("active");

    }

    initFirstDiagram() {
        var pieChartCanvas = $('#pieChartFirst').get(0).getContext('2d');
        var donutData        = {
            labels: [
                'Red',
                'Orange',
                'Yellow',
                'Green',
                'Blue',
            ],
            datasets: [
                {
                    data: [700,500,400,600,300],
                    backgroundColor : ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
                }
            ]
        }
        var pieOptions     = {
            maintainAspectRatio : false,
            responsive : true,
        }

        new Chart(pieChartCanvas, {
            type: 'pie',
            data: donutData,
            options: pieOptions
        })
    }

    initSecondDiagram() {
        var pieChartCanvas = $('#pieChartSecond').get(0).getContext('2d');
        var donutData        = {
            labels: [
                'Red',
                'Orange',
                'Yellow',
                'Green',
                'Blue',
            ],
            datasets: [
                {
                    data: [700,500,400,600,300],
                    backgroundColor : ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
                }
            ]
        }
        var pieOptions     = {
            maintainAspectRatio : false,
            responsive : true,
        }

        new Chart(pieChartCanvas, {
            type: 'pie',
            data: donutData,
            options: pieOptions
        })
    }
}