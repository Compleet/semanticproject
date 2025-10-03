/**
 * PKM Performance Monitor - Enterprise-grade observability
 * Inspired by ClickUp's performance monitoring and Anytype's optimization strategies
 */

class PKMPerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTimes: [],
      searchTimes: [],
      renderTimes: [],
      memoryUsage: [],
      errorCount: 0,
      userActions: []
    };

    this.thresholds = {
      loadTime: 500, // ms
      searchTime: 50,  // ms
      renderTime: 16,  // ms (60fps)
      memoryLimit: 50 * 1024 * 1024, // 50MB
    };

    this.observers = {
      performance: null,
      memory: null,
      errors: null
    };

    this.initialize();
  }

  initialize() {
    this.setupPerformanceObserver();
    this.setupMemoryMonitoring();
    this.setupErrorTracking();
    this.setupUserActionTracking();

    // Report metrics every 30 seconds
    setInterval(() => this.reportMetrics(), 30000);
  }

  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.observers.performance = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordPerformanceMetric(entry);
        }
      });

      this.observers.performance.observe({
        entryTypes: ['navigation', 'measure', 'paint', 'largest-contentful-paint']
      });
    }
  }

  setupMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        this.metrics.memoryUsage.push({
          timestamp: Date.now(),
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });

        // Keep only last 100 measurements
        if (this.metrics.memoryUsage.length > 100) {
          this.metrics.memoryUsage.shift();
        }

        // Alert if memory usage is high
        if (memory.usedJSHeapSize > this.thresholds.memoryLimit) {
          this.alertHighMemoryUsage(memory);
        }
      }, 5000);
    }
  }

  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.recordError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: Date.now()
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        type: 'promise',
        message: event.reason.toString(),
        timestamp: Date.now()
      });
    });
  }

  setupUserActionTracking() {
    // Track critical user interactions
    const trackableEvents = ['click', 'keydown', 'scroll', 'resize'];

    trackableEvents.forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        this.recordUserAction(eventType, event);
      }, { passive: true });
    });
  }

  recordPerformanceMetric(entry) {
    switch (entry.entryType) {
      case 'navigation':
        this.metrics.loadTimes.push({
          timestamp: Date.now(),
          domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
          loadComplete: entry.loadEventEnd - entry.loadEventStart,
          total: entry.loadEventEnd - entry.fetchStart
        });
        break;

      case 'measure':
        if (entry.name.includes('search')) {
          this.metrics.searchTimes.push({
            timestamp: Date.now(),
            duration: entry.duration,
            name: entry.name
          });
        } else if (entry.name.includes('render')) {
          this.metrics.renderTimes.push({
            timestamp: Date.now(),
            duration: entry.duration,
            name: entry.name
          });
        }
        break;
    }
  }

  recordError(error) {
    this.metrics.errorCount++;
    console.error('PKM Error Tracked:', error);

    // Show user-friendly error notification
    if (window.showNotification) {
      showNotification('An error occurred. Our team has been notified.', 'error');
    }
  }

  recordUserAction(type, event) {
    // Only record significant actions to avoid spam
    if (type === 'click' && event.target.closest('button, .clickable, [onclick]')) {
      this.metrics.userActions.push({
        type: 'click',
        target: event.target.tagName.toLowerCase(),
        className: event.target.className,
        timestamp: Date.now()
      });
    }
  }

  alertHighMemoryUsage(memory) {
    console.warn('High memory usage detected:', {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB'
    });

    if (window.showNotification) {
      showNotification('High memory usage detected. Consider refreshing the page.', 'warning');
    }
  }

  measureSearchPerformance(searchFunction) {
    return async (...args) => {
      const startTime = performance.now();
      performance.mark('search-start');

      try {
        const result = await searchFunction(...args);

        const endTime = performance.now();
        performance.mark('search-end');
        performance.measure('search-duration', 'search-start', 'search-end');

        const duration = endTime - startTime;
        if (duration > this.thresholds.searchTime) {
          console.warn(`Slow search detected: ${duration.toFixed(2)}ms`);
        }

        return result;
      } catch (error) {
        this.recordError({
          type: 'search',
          message: error.message,
          timestamp: Date.now()
        });
        throw error;
      }
    };
  }

  measureRenderPerformance(renderFunction) {
    return (...args) => {
      const startTime = performance.now();
      performance.mark('render-start');

      const result = renderFunction(...args);

      // Use requestAnimationFrame to measure after paint
      requestAnimationFrame(() => {
        const endTime = performance.now();
        performance.mark('render-end');
        performance.measure('render-duration', 'render-start', 'render-end');

        const duration = endTime - startTime;
        if (duration > this.thresholds.renderTime) {
          console.warn(`Slow render detected: ${duration.toFixed(2)}ms`);
        }
      });

      return result;
    };
  }

  getPerformanceReport() {
    const currentMemory = performance.memory ? {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
    } : null;

    return {
      timestamp: Date.now(),
      loadTimes: this.metrics.loadTimes.slice(-10),
      averageSearchTime: this.calculateAverage(this.metrics.searchTimes.slice(-20), 'duration'),
      averageRenderTime: this.calculateAverage(this.metrics.renderTimes.slice(-20), 'duration'),
      currentMemory,
      errorCount: this.metrics.errorCount,
      userActionCount: this.metrics.userActions.length,
      performance: {
        searchesPerformed: this.metrics.searchTimes.length,
        rendersPerformed: this.metrics.renderTimes.length,
        slowSearches: this.metrics.searchTimes.filter(s => s.duration > this.thresholds.searchTime).length,
        slowRenders: this.metrics.renderTimes.filter(r => r.duration > this.thresholds.renderTime).length
      }
    };
  }

  calculateAverage(metrics, property) {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, metric) => acc + metric[property], 0);
    return Math.round(sum / metrics.length * 100) / 100;
  }

  reportMetrics() {
    const report = this.getPerformanceReport();
    console.log('PKM Performance Report:', report);

    // In a real system, this would send to analytics service
    // analytics.track('pkm_performance_report', report);
  }

  // Public API for manual performance measurement
  startMeasurement(name) {
    performance.mark(`${name}-start`);
    return {
      end: () => {
        performance.mark(`${name}-end`);
        performance.measure(`${name}-duration`, `${name}-start`, `${name}-end`);
      }
    };
  }
}

// Global performance monitor instance
window.PKMPerformanceMonitor = PKMPerformanceMonitor;
