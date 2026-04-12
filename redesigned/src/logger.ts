// Adapted from http://web.mit.edu/6.813/www/sp18/assignments/as1-implementation/logging.js
//
// A simple Google-spreadsheet-based event logging framework.
//
// Add logging.js to your Web App to log standard input and custom events.
//
// This is currently set up to log every mousedown and keydown
// event, as well as any events that might be triggered within
// the app by triggering the 'log' event anywhere in the doc
// as follows:
//
// document.dispatchEvent(new CustomEvent('log', { detail: {
//   eventName: 'myevent',
//   info: {key1: val1, key2: val2}
// }}));

var ENABLE_NETWORK_LOGGING = true; // Controls network logging.
var ENABLE_CONSOLE_LOGGING = true; // Controls console logging.
var LOG_VERSION = '0.1';           // Labels every entry with version: "0.1".

// These event types are intercepted for logging before jQuery handlers.
var EVENT_TYPES_TO_LOG: Record<string, boolean> = {
  mousedown: true,
  keydown: true
};

// These event properties are copied to the log if present.
var EVENT_PROPERTIES_TO_LOG: Record<string, boolean> = {
  which: true,
  pageX: true,
  pageY: true
};

// This function is called to record some global state on each event.
var GLOBAL_STATE_TO_LOG = function() {
  return {};
};

// ---- Experiment tracking state ----
var INTERFACE_VERSION = 'redesigned';
var taskStartTime: number | null = null;
var errorCount = 0;
var errorLog: Array<{type: string, detail: string, timestamp: number}> = [];

/////////////////////////////////////////////////////////////////////////////
// CHANGE ME:
// ** Replace the function below by substituting your own google form. **
/////////////////////////////////////////////////////////////////////////////
//
// 1. Create a Google form called "Network Log" at forms.google.com.
// 2. Set it up to have several "short answer" questions; here we assume
//    seven questions: uid, time, eventName, target, info, state, version.
// 3. Run googlesender.py to make a javascript
//    function that submits records directly to the form.
// 4. Put that function in here, and replace the current sendNetworkLog
//    so that your version is called to log events to your form.
//
// For example, the following code was written as follows:
// python googlesender.py https://docs.google.com/forms/d/e/1.../viewform
//
// This preocess changes the ids below to direct your data into your own
// form and spreadsheet. The formid must be customized, and also the form
// field names such as "entry.1291686978" must be matched to your form.
// (The numerical field names for a Google form can be found by inspecting
// the form input fields.) This can be done manually, but since this is an
// error-prone process, it can be easier to use googlesender.py.
//
/////////////////////////////////////////////////////////////////////////////

function sendNetworkLog(
    uid: string,
    time: number,
    eventName: string,
    target: string,
    info: string,
    state: string,
    log_version: string) {
  var payload = JSON.stringify({
    uid: uid,
    time: time,
    eventName: eventName,
    target: target,
    info: info,
    state: state,
    version: log_version
  });
  fetch("https://script.google.com/macros/s/AKfycbzW5Eqtl1ia-d8YxAnDcITZ_WOUCPg2BSmDEeD5XBJfTpf9an8JRQyH_QEBcAdGVl-2HA/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: payload
  }).catch(function() {});
}

// Parse user agent string by looking for recognized substring.
function findFirstString(str: string, choices: string[]) {
  for (var j = 0; j < choices.length; j++) {
    if (str.indexOf(choices[j]) >= 0) {
      return choices[j];
    }
  }
  return '?';
}

// Generates or remembers a somewhat-unique ID with distilled user-agent info.
function getUniqueId() {
  if (!('uid' in localStorage)) {
    var browser = findFirstString(navigator.userAgent, [
      'Seamonkey', 'Firefox', 'Chromium', 'Chrome', 'Safari', 'OPR', 'Opera',
      'Edge', 'MSIE', 'Blink', 'Webkit', 'Gecko', 'Trident', 'Mozilla']);
    var os = findFirstString(navigator.userAgent, [
      'Android', 'iOS', 'Symbian', 'Blackberry', 'Windows Phone', 'Windows',
      'OS X', 'Linux', 'iOS', 'CrOS']).replace(/ /g, '_');
    var unique = ('' + Math.random()).substr(2);
    localStorage['uid'] = os + '-' + browser + '-' + unique;
  }
  return localStorage['uid'];
}

// A persistent unique id for the user.
var uid = getUniqueId();

// Returns a CSS selector that is descriptive of
// the element, for example, "td.left div" for
// a class-less div within a td of class "left".
function elementDesc(elt: any): string {
  if (elt == document) {
    return 'document';
  } else if (elt == window) {
    return 'window';
  }
  function descArray(elt: any) {
    var desc = [elt.tagName.toLowerCase()];
    if (elt.id) {
      desc.push('#' + elt.id);
    }
    for (var j = 0; j < elt.classList.length; j++) {
      desc.push('.' + elt.classList[j]);
    }
    return desc;
  }
  var desc: string[] = [];
  while (elt && desc.length <= 1) {
    var desc2 = descArray(elt);
    if (desc.length == 0) {
      desc = desc2;
    } else if (desc2.length > 1) {
      desc2.push(' ', desc[0]);
      desc = desc2;
    }
    elt = elt.parentElement;
  }
  return desc.join('');
}

// Log the given event.
function logEvent(event: any, customName?: string, customInfo?: any) {

  console.log('event', event, 'customName', customName, 'customInfo', customInfo);

  var time = (new Date).getTime();
  var eventName = customName || event.type;
  // By default, monitor some global state on every event.
  var infoObj: any = GLOBAL_STATE_TO_LOG();
  // And monitor a few interesting fields from the event, if present.
  for (var key in EVENT_PROPERTIES_TO_LOG) {
    if (event && key in event) {
      infoObj[key] = event[key];
    }
  }
  // Let a custom event add fields to the info.
  if (customInfo) {
    infoObj = Object.assign(infoObj, customInfo);
  }
  var info = JSON.stringify(infoObj);
  var target = 'document';
  if (event) { target = elementDesc(event.target); }
  var state = location.hash;

  if (ENABLE_CONSOLE_LOGGING) {
    console.log(uid, time, eventName, target, info, state, LOG_VERSION);
  }
  if (ENABLE_NETWORK_LOGGING) {
    sendNetworkLog(uid, time, eventName, target, info, state, LOG_VERSION);
  }
}

// ---- Experiment-specific functions for DV1 & DV2 ----

// Helper to read experiment metadata from URL query params
// Save experiment metadata on first page load (before navigation changes the URL)
var savedMeta = (function() {
  var params = new URLSearchParams(window.location.search);
  return {
    pid: params.get('pid') || '',
    complexity: params.get('complexity') || '',
    prompt: params.get('prompt') || '',
    set: params.get('set') || ''
  };
})();

function getExperimentMeta() {
  return savedMeta;
}

// Call when user clicks "Post an Ad" — starts the task timer (DV1)
function startTask() {
  taskStartTime = Date.now();
  errorCount = 0;
  errorLog = [];

  var meta = getExperimentMeta();
  var info = JSON.stringify({
    action: 'task_start',
    interface: INTERFACE_VERSION,
    pid: meta.pid,
    complexity: meta.complexity,
    prompt: meta.prompt,
    set: meta.set
  });

  if (ENABLE_CONSOLE_LOGGING) {
    console.log('[Experiment] Task started at', taskStartTime);
  }
  if (ENABLE_NETWORK_LOGGING) {
    sendNetworkLog(uid, taskStartTime, 'task_start', 'post_an_ad_button', info, location.hash, LOG_VERSION);
  }
}

// Call when user clicks "Publish" — ends the task timer (DV1), sends summary
function endTask() {
  var endTime = Date.now();
  var completionTimeSec = taskStartTime ? (endTime - taskStartTime) / 1000 : -1;

  var meta = getExperimentMeta();
  var info = JSON.stringify({
    action: 'task_end',
    interface: INTERFACE_VERSION,
    taskCompletionTimeSec: completionTimeSec,
    totalErrors: errorCount,
    errorBreakdown: errorLog,
    pid: meta.pid,
    complexity: meta.complexity,
    prompt: meta.prompt,
    set: meta.set
  });

  if (ENABLE_CONSOLE_LOGGING) {
    console.log('[Experiment] Task ended. Time:', completionTimeSec, 's | Errors:', errorCount);
  }
  if (ENABLE_NETWORK_LOGGING) {
    sendNetworkLog(uid, endTime, 'task_end', 'publish_button', info, location.hash, LOG_VERSION);
  }
}

// Call when an error occurs (DV2)
// errorType: 'validation' | 'wrong_category' | 'misclick' | 'incorrect_input'
function logError(errorType: string, detail: string) {
  errorCount++;
  var timestamp = Date.now();
  errorLog.push({ type: errorType, detail: detail, timestamp: timestamp });

  var meta = getExperimentMeta();
  var info = JSON.stringify({
    action: 'error',
    interface: INTERFACE_VERSION,
    errorType: errorType,
    detail: detail,
    errorCountSoFar: errorCount,
    pid: meta.pid,
    complexity: meta.complexity,
    prompt: meta.prompt,
    set: meta.set
  });

  if (ENABLE_CONSOLE_LOGGING) {
    console.log('[Experiment] Error #' + errorCount + ':', errorType, '-', detail);
  }
  if (ENABLE_NETWORK_LOGGING) {
    sendNetworkLog(uid, timestamp, 'error', errorType, info, location.hash, LOG_VERSION);
  }
}

// Call on view navigation to track user path
function logNavigation(from: string, to: string) {
  var timestamp = Date.now();
  var info = JSON.stringify({
    action: 'navigation',
    interface: INTERFACE_VERSION,
    from: from,
    to: to
  });

  if (ENABLE_CONSOLE_LOGGING) {
    console.log('[Experiment] Navigation:', from, '→', to);
  }
  if (ENABLE_NETWORK_LOGGING) {
    sendNetworkLog(uid, timestamp, 'navigation', from + '_to_' + to, info, location.hash, LOG_VERSION);
  }
}

// Hook up low-level event capturing
if (ENABLE_NETWORK_LOGGING) {
  for (var event_type in EVENT_TYPES_TO_LOG) {
    document.addEventListener(event_type, logEvent, true);
  }
}

// Export for use in React components
export { logEvent, startTask, endTask, logError, logNavigation };
