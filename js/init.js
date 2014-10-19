
var root = document.querySelector('body');
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    root.classList.add('mobile-version')
} else {
    root.classList.add('pc-version')
}


var Boxlayout = (function() {

    var $el = $('#main_wrap'),
        $sections = $el.children('section'),
        // works section
        $sectionWork = $('#work-list'),
        // work items
        $workItems = $('#bl-work-items > li'),
        // work panels
        $workPanelsContainer = $('#panel_items_content'),
        $workPanels = $workPanelsContainer.children('div'),
        totalWorkPanels = $workPanels.length,
        // navigating the work panels
        $nextWorkItem = $workPanelsContainer.find('nav > span.next_work_item'),
        $prevWorkItem = $workPanelsContainer.find('nav > span.prev_work_item'),
        // if currently navigating the work items
        isAnimating = false,
        // close work panel trigger
        $closeWorkItem = $workPanelsContainer.find('nav > span.close_icons'),
        transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },
        // transition end event name
        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
        // support css transitions
        supportTransitions = Modernizr.csstransitions;

    function init() {
        initEvents();
    }

    function initEvents() {

        $sections.not(':first-child').each(function() {

            var $section = $(this);

            // expand the clicked section and scale down the others
            $section.on('click', function() {

                if (!$section.data('open')) {
                    $section.data('open', true).addClass('opened_box opened_box_top');
                    $el.addClass('opened_box_item');
                }

            }).find('span.close_icons').on('click', function() {

                // close the expanded section and scale up the others
                $section.data('open', false).removeClass('opened_box').on(transEndEventName, function(event) {
                    if (!$(event.target).is('section')) return false;
                    $(this).off(transEndEventName).removeClass('opened_box_top');
                });

                if (!supportTransitions) {
                    $section.removeClass('opened_box_top');
                }

                $el.removeClass('opened_box_item');

                return false;

            });

        });

        // clicking on a work item: the current section scales down and the respective work panel slides up
        $workItems.on('click', function(event) {

            // scale down main section
            $sectionWork.addClass('bl-scale-down');

            // show panel for this work item
            $workPanelsContainer.addClass('works_items-show');

            var $panel = $workPanelsContainer.find("[data-panel='" + $(this).data('panel') + "']");
            currentWorkPanel = $panel.index();
            $panel.addClass('bl-show-work');

            return false;

        });

        // navigating the work items: current work panel scales down and the next work panel slides up
        $nextWorkItem.on('click', function(event) {

            if (isAnimating) {
                return false;
            }
            isAnimating = true;

            var $currentPanel = $workPanels.eq(currentWorkPanel);
            currentWorkPanel = currentWorkPanel < totalWorkPanels - 1 ? currentWorkPanel + 1 : 0;
            var $nextPanel = $workPanels.eq(currentWorkPanel);

            $currentPanel.removeClass('bl-show-work').addClass('bl-hide-current-work').on(transEndEventName, function(event) {
                if (!$(event.target).is('div')) return false;
                $(this).off(transEndEventName).removeClass('bl-hide-current-work');
                isAnimating = false;
            });

            if (!supportTransitions) {
                $currentPanel.removeClass('bl-hide-current-work');
                isAnimating = false;
            }

            $nextPanel.addClass('bl-show-work');

            return false;

        });
        $prevWorkItem.on('click', function(event) {

            if (isAnimating) {
                return false;
            }
            isAnimating = true;

            var $currentPanel = $workPanels.eq(currentWorkPanel);
            currentWorkPanel = currentWorkPanel < totalWorkPanels - 1 ? currentWorkPanel -1 : 0;
            var $prevPanel = $workPanels.eq(currentWorkPanel);

            $currentPanel.removeClass('bl-show-work').addClass('bl-hide-current-work').on(transEndEventName, function(event) {
                if (!$(event.target).is('div')) return false;
                $(this).off(transEndEventName).removeClass('bl-hide-current-work');
                isAnimating = false;
            });

            if (!supportTransitions) {
                $currentPanel.removeClass('bl-hide-current-work');
                isAnimating = false;
            }

            $prevPanel.addClass('bl-show-work');

            return false;

        });

        // clicking the work panels close button: the current work panel slides down and the section scales up again
        $closeWorkItem.on('click', function(event) {

            // scale up main section
            $sectionWork.removeClass('bl-scale-down');
            $workPanelsContainer.removeClass('works_items-show');
            $workPanels.eq(currentWorkPanel).removeClass('bl-show-work');

            return false;

        });

    }

    return {
        init: init
    };

})();
