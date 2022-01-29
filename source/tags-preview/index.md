---
title: Tags 预览
layout: page
---

## message

{% message color:danger icon:info-circle 'title:Very danger!' size:small %}
    **You are in danger.**
{% endmessage %}

{% message color:danger 'title:Very danger!' size:small %}
    **You are in danger.**
{% endmessage %}

{% message color:primary icon:info-circle %}
        **You are not in danger.**
{% endmessage %}

## tabs

{% tabs behavior:centered style:toggle-rounded %}
    <!-- tab aadd1 'AADD' -->This is AADD.<!-- endtab -->
    <!-- activetab info1 info 'Info' -->This is Info.<!-- endtab -->
{% endtabs %}

{% tabs behavior:fullwidth size:small style:boxed %}
    <!-- tab aadd2 'AADD' -->
        - assdf
        - aege
    <!-- endtab -->
    <!-- activetab info2 info 'Info' -->
        [sad]()
    <!-- endtab -->
{% endtabs %}