
/**
 * Service de debug pour les appels API
 */

export interface ApiDebugInfo {
  url: string;
  method: string;
  headers: Record<string, string>;
  requestBody?: any;
  responseStatus?: number;
  responseData?: any;
  error?: Error;
  timestamp: string;
}

class ApiDebugger {
  private debugEnabled = true;
  private logs: ApiDebugInfo[] = [];

  enableDebug() {
    this.debugEnabled = true;
  }

  disableDebug() {
    this.debugEnabled = false;
  }

  logRequest(info: Omit<ApiDebugInfo, 'timestamp'>) {
    if (!this.debugEnabled) return;
    
    const logEntry: ApiDebugInfo = {
      ...info,
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(logEntry);
    
    console.group(`🌐 API ${info.method} ${info.url}`);
    console.log('📅 Timestamp:', logEntry.timestamp);
    console.log('🔗 URL:', info.url);
    console.log('📋 Headers:', info.headers);
    
    if (info.requestBody) {
      console.log('📤 Request Body:', info.requestBody);
    }
    
    if (info.responseStatus) {
      console.log('📊 Response Status:', info.responseStatus);
    }
    
    if (info.responseData) {
      console.log('📥 Response Data:', info.responseData);
    }
    
    if (info.error) {
      console.error('❌ Error:', info.error);
    }
    
    console.groupEnd();
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const apiDebugger = new ApiDebugger();
