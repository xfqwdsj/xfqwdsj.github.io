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

{% message color:primary %}
    **You are not in danger.**
{% endmessage %}

## tabs

{% tabs behavior:centered style:toggle-rounded %}
    <!-- item aadd1 'AADD' -->This is AADD.<!-- enditem -->
    <!-- activeitem info1 info 'Info' -->This is Info.<!-- enditem -->
{% endtabs %}

{% tabs behavior:fullwidth size:small style:boxed %}
    <!-- item aadd2 'AADD' -->
        - assdf
          - asd
        - aege
          - sasd
    <!-- enditem -->
    <!-- activeitem info2 info 'Info' -->
        [sad]()
    <!-- enditem -->
    <!-- item sb 'hl' -->
            asd
            sdf
    <!-- enditem -->
    <!-- item qwr 'asd' -->
    - aa
        - ff
        <!-- enditem -->
{% endtabs %}