---
layout: page
title: Log
permalink: /log/
date: "2017-08-31 17:25:55"
---

<div class="log-list">
    {%- for log in site.categories.log -%}
    {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
    <div class="post-item-head">
        <h3><a class="post-link" href="{{ log.url | relative_url }}">{{ log.title | escape }}</a></h3>
    </div>
        <span class="post-meta">
            <span class="post-tags">
                {% for tag in log.tags limit:2 %}
                <span class="post-tag"><a href="/search.html?term={{ tag }}">{{ tag }}</a></span>
                {% endfor %}
            </span>
            <span class="post-tags">
                {% for category in log.categories limit:1 %}
                <span class="post-category"><a href="/search.html?term={{ category }}">{{ category }}</a></span>
                {% endfor %}
            </span>
            <span class="log-date">
               {{ log.date | date: '%Y %B %d' }}
            </span>
        </span>
    {%- endfor -%}
</div>