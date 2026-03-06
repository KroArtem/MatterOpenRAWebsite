(function () {
  function getOperatingSystemFromHash (hash) {
    switch (hash) {
      case '#windows':
        return 'windows';
      case '#macos':
        return 'macos';
      case '#free-bsd':
        return 'free-bsd';
      case '#linux':
        return 'linux';
      case '#source':
        return 'source';
      default:
        return null;
    }
  }

  function operatingSystem () {
    const ua = navigator.userAgent || '';
    let os;
    if (ua.indexOf('Win') !== -1) os = 'windows'; 
    if (ua.indexOf('Mac') !== -1) os = 'macos'; 
    if (ua.indexOf('Linux') !== -1) os = 'linux'; 

    return os;
  }  

  const defaultInstruction = getOperatingSystemFromHash(window.location.hash) || operatingSystem() || 'source';

  function setActiveInstruction (os) {
    $('.instruction').hide();
    $('#' + os +'-instructions').show();
  }

  $('input[name="operating-system"]').on('change', function (event) {
    window.location.hash = event.target.value;
  });

  $(window).on('hashchange', function () {
    const os = getOperatingSystemFromHash(window.location.hash) || 'source';
    setActiveInstruction(os);
  });

  setActiveInstruction(defaultInstruction);
  document.querySelector('.download__os-' + defaultInstruction + ' input').checked = true;
})();