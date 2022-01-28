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

{% message color:danger icon:info-circle %}
    **You are in danger.**
{% endmessage %}

## tabs

{% tabs behavior:centered style:toggle-rounded %}
    <!-- tab aadd AADD -->This is AADD.<!-- endtab -->
    <!-- activetab info info Info -->This is Info.<!-- endtab -->
{% endtabs %}