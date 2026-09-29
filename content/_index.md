---
title: "PiDNS Portal"
# Data used by layouts/index.html to render the card grid

services:
  - name: "PiDNS Grafana"
    url: "https://grafana.mrejinet.co.uk"
    desc: "Single pane of glass for all PiDNS infrastructure observability, metrics, log aggregation, and analytics. Requires Zero Trust login."

dashboards:
  - name: "Fleet Overview"
    uid: "fleet-overview"
    desc: "Top-level view of all 6 PiDNS nodes regarding health, uptime, load averages, memory, and global alerts."
  - name: "Service Health"
    uid: "service-health"
    desc: "Core backend service validation including primary Pi-holes, Unbound instances, local caching, and the VPN subsystem."
  - name: "DNS Analytics"
    uid: "dns-analytics"
    desc: "Detailed telemetry on query volume, top requested domains, top blocked clients, cache hit rates, and upstream forward latency."
  - name: "Network Quality"
    uid: "network-quality"
    desc: "Blackbox prober results tracking LAN latency, internet reachability via ICMP, and periodic WAN bandwidth speed tests."
  - name: "Synthetic Monitoring"
    uid: "synthetic-monitoring"
    desc: "Endpoint probes checking HTTP statuses for core web interfaces, alongside default gateway metrics to ensure continuous internet availability."
  - name: "Node Exporter Full"
    uid: "rYdddlPWk"
    desc: "Granular hardware metrics per-node: detailed CPU utilization breakdowns, memory/swap graphs, mountpoint disk usage, and network interface traffic."
---

