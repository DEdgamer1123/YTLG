// Charts JavaScript - Enhanced Mobile Responsiveness

// Global chart configuration for mobile optimization
Chart.defaults.font.family = 'Poppins';
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

// Enhanced mobile-first chart configurations
window.ChartConfig = {
    // Base responsive configuration
    getResponsiveConfig: function() {
        const isMobile = window.innerWidth <= 767;
        
        return {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            plugins: {
                legend: {
                    position: isMobile ? 'bottom' : 'bottom',
                    labels: {
                        padding: isMobile ? 10 : 20,
                        usePointStyle: true,
                        font: {
                            size: isMobile ? 10 : 12,
                            family: 'Poppins'
                        },
                        boxWidth: isMobile ? 12 : 15,
                        boxHeight: isMobile ? 12 : 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#a6a4ff',
                    borderWidth: 1,
                    titleFont: {
                        family: 'Poppins',
                        size: isMobile ? 12 : 14
                    },
                    bodyFont: {
                        family: 'Poppins',
                        size: isMobile ? 11 : 13
                    },
                    padding: isMobile ? 8 : 12
                }
            }
        };
    },
    
    // Scale configuration for mobile
    getScaleConfig: function() {
        const isMobile = window.innerWidth <= 767;
        
        return {
            x: {
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: isMobile ? 10 : 12
                    },
                    maxRotation: isMobile ? 45 : 0,
                    minRotation: 0
                },
                title: {
                    display: true,
                    font: {
                        family: 'Poppins',
                        size: isMobile ? 12 : 14,
                        weight: 'bold'
                    }
                }
            },
            y: {
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: isMobile ? 10 : 12
                    }
                },
                title: {
                    display: true,
                    font: {
                        family: 'Poppins',
                        size: isMobile ? 12 : 14,
                        weight: 'bold'
                    }
                }
            }
        };
    },
    
    // Title configuration
    getTitleConfig: function(title) {
        const isMobile = window.innerWidth <= 767;
        
        return {
            display: true,
            text: title,
            font: {
                size: isMobile ? 14 : 18,
                weight: 'bold',
                family: 'Poppins'
            },
            color: '#0e0e0e',
            padding: {
                bottom: isMobile ? 10 : 20
            }
        };
    }
};

// Enhanced data validation with better error messaging
window.validateChartData = function(labels, data, chartType = 'general') {
    const errors = [];
    
    if (!labels || labels.length === 0) {
        errors.push('Se requieren etiquetas para el gráfico');
    }
    
    if (!data || data.length === 0) {
        errors.push('Se requieren datos para el gráfico');
    }
    
    if (labels && data && labels.length !== data.length) {
        errors.push('El número de etiquetas debe coincidir con el número de datos');
    }
    
    if (data) {
        const invalidData = data.filter(value => isNaN(value) || !isFinite(value));
        if (invalidData.length > 0) {
            errors.push('Todos los valores deben ser números válidos');
        }
    }
    
    // Chart-specific validations
    if (chartType === 'scatter' && data) {
        const hasValidCoordinates = data.every(point => 
            point && typeof point === 'object' && 
            !isNaN(point.x) && !isNaN(point.y)
        );
        if (!hasValidCoordinates) {
            errors.push('Los datos de dispersión requieren coordenadas X e Y válidas');
        }
    }
    
    if (chartType === 'gauge') {
        if (data.length !== 1) {
            errors.push('El gráfico de indicador requiere exactamente un valor');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

// Enhanced chart creation with mobile optimization
window.createResponsiveChart = function(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas element not found:', canvasId);
        return null;
    }
    
    // Ensure canvas has proper sizing
    const container = canvas.parentElement;
    const containerWidth = container.offsetWidth;
    const containerHeight = Math.min(container.offsetHeight, window.innerHeight * 0.6);
    
    // Set canvas size constraints
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = containerHeight + 'px';
    
    // Merge with responsive configuration
    const responsiveConfig = ChartConfig.getResponsiveConfig();
    const mergedConfig = {
        ...config,
        options: {
            ...responsiveConfig,
            ...config.options,
            plugins: {
                ...responsiveConfig.plugins,
                ...config.options?.plugins
            }
        }
    };
    
    // Create chart with error handling
    try {
        const chart = new Chart(canvas, mergedConfig);
        
        // Add resize handler for better mobile support
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (chart) {
                    chart.resize();
                }
            }, 250);
        });
        
        return chart;
    } catch (error) {
        console.error('Error creating chart:', error);
        showChartError(container, 'Error al crear el gráfico. Por favor, verifica los datos ingresados.');
        return null;
    }
};

// Error display for charts
function showChartError(container, message) {
    container.innerHTML = `
        <div class="chart-error" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            color: #e74c3c;
            text-align: center;
            min-height: 200px;
        ">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.7;"></i>
            <h3 style="margin-bottom: 0.5rem; font-size: 1.2rem;">Error en el Gráfico</h3>
            <p style="margin: 0; opacity: 0.8;">${message}</p>
        </div>
    `;
}

// Enhanced form data collection with validation
window.collectFormData = function(formId, dataType = 'standard') {
    const form = document.getElementById(formId);
    if (!form) return null;
    
    const title = form.querySelector('#chartTitle')?.value || 'Gráfico';
    const xAxisLabel = form.querySelector('#xAxisLabel')?.value || '';
    const yAxisLabel = form.querySelector('#yAxisLabel')?.value || '';
    
    const dataEntries = form.querySelectorAll('.data-entry');
    const labels = [];
    const data = [];
    
    dataEntries.forEach(entry => {
        const inputs = entry.querySelectorAll('.form-input');
        
        if (dataType === 'scatter') {
            // For scatter plots, collect X,Y coordinates
            const x = parseFloat(inputs[0]?.value);
            const y = parseFloat(inputs[1]?.value);
            
            if (!isNaN(x) && !isNaN(y)) {
                data.push({x: x, y: y});
            }
        } else {
            // Standard label-value pairs
            const label = inputs[0]?.value?.trim();
            const value = parseFloat(inputs[1]?.value);
            
            if (label && !isNaN(value)) {
                labels.push(label);
                data.push(value);
            }
        }
    });
    
    return {
        title,
        xAxisLabel,
        yAxisLabel,
        labels,
        data
    };
};

// Mobile-optimized chart options generators
window.getChartOptions = function(type, title, xAxisLabel = '', yAxisLabel = '') {
    const baseConfig = ChartConfig.getResponsiveConfig();
    const scaleConfig = ChartConfig.getScaleConfig();
    const titleConfig = ChartConfig.getTitleConfig(title);
    
    const options = {
        ...baseConfig,
        plugins: {
            ...baseConfig.plugins,
            title: titleConfig
        }
    };
    
    // Add scales for chart types that need them
    if (['bar', 'line'].includes(type)) {
        options.scales = {
            ...scaleConfig,
            x: {
                ...scaleConfig.x,
                title: {
                    ...scaleConfig.x.title,
                    text: xAxisLabel
                }
            },
            y: {
                ...scaleConfig.y,
                title: {
                    ...scaleConfig.y.title,
                    text: yAxisLabel
                },
                beginAtZero: true
            }
        };
    }
    
    // Scatter plot specific configuration
    if (type === 'scatter') {
        options.scales = {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: xAxisLabel,
                    font: {
                        size: window.innerWidth <= 767 ? 12 : 14,
                        weight: 'bold',
                        family: 'Poppins'
                    }
                },
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: window.innerWidth <= 767 ? 10 : 12
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: yAxisLabel,
                    font: {
                        size: window.innerWidth <= 767 ? 12 : 14,
                        weight: 'bold',
                        family: 'Poppins'
                    }
                },
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: window.innerWidth <= 767 ? 10 : 12
                    }
                }
            }
        };
    }
    
    // Pie and doughnut charts
    if (['pie', 'doughnut'].includes(type)) {
        options.plugins.legend.position = window.innerWidth <= 767 ? 'bottom' : 'bottom';
        options.plugins.tooltip.callbacks = {
            label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
            }
        };
    }
    
    return options;
};

// Color scheme utilities
window.getColorScheme = function(count) {
    const colors = [
        '#a6a4ff', '#aab1ff', '#7042b5', '#18936f', '#ff6b6b',
        '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b',
        '#6c5ce7', '#fd79a8', '#e17055', '#00b894', '#0984e3'
    ];
    
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(colors[i % colors.length]);
    }
    
    return result;
};

// Download functionality
window.downloadChart = function(chart, filename = 'grafico') {
    if (!chart) {
        if (window.showNotification) {
            showNotification('No hay gráfico para descargar', 'error');
        } else {
            alert('Primero crea un gráfico para poder descargarlo.');
        }
        return;
    }
    
    try {
        const link = document.createElement('a');
        link.download = `${filename}-${new Date().getTime()}.png`;
        link.href = chart.toBase64Image('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        if (window.showNotification) {
            showNotification('Gráfico descargado exitosamente', 'success');
        }
    } catch (error) {
        console.error('Error downloading chart:', error);
        if (window.showNotification) {
            showNotification('Error al descargar el gráfico', 'error');
        } else {
            alert('Error al descargar el gráfico');
        }
    }
};

// Enhanced mobile detection and handling
window.isMobileDevice = function() {
    return window.innerWidth <= 767 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Debounced resize handler for charts
window.handleChartResize = function(chart) {
    let resizeTimeout;
    
    function resize() {
        if (chart && chart.resize) {
            chart.resize();
        }
    }
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 300);
    });
    
    // Also handle orientation change on mobile
    window.addEventListener('orientationchange', function() {
        setTimeout(resize, 500);
    });
};

// Initialize mobile optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add viewport meta tag if not present (ensures proper mobile rendering)
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(viewport);
    }
    
    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Enhanced touch handling for chart containers
    document.querySelectorAll('#chartContainer').forEach(container => {
        container.style.touchAction = 'pan-x pan-y';
        container.style.userSelect = 'none';
    });
});

// Global error handler for charts
window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('Chart')) {
        console.error('Chart error detected:', e);
        // Could show user-friendly error message here
    }
});

// Utility to ensure chart containers have proper sizing
window.ensureChartContainerSizing = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Force container to respect mobile viewport
    if (window.innerWidth <= 767) {
        const maxWidth = Math.min(container.parentElement.offsetWidth, window.innerWidth - 32);
        container.style.maxWidth = maxWidth + 'px';
        container.style.width = '100%';
        container.style.overflow = 'hidden';
    }
};
