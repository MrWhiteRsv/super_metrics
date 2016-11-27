# Responsible for publishing a data file 

import time
import sys, getopt

import json
import paho.mqtt.publish as publish

def pub(topic, payload):
  hostname = "li1109-31.members.linode.com"
  publish.single(topic, payload, hostname=hostname) 

   
def publish_log(file_name):  
  log_file = open('path_1_stragiht_line.dat', 'r')
  #log_file = open(file_name)
  record_start_time = None
  play_start_time = int(time.time())
  for line in log_file:
    if (len(line) == 1):
      continue
    try:
      parsed_line = json.loads(line)
    except ValueError:
      print("Could not parse line: " + line)
      continue
    topic = parsed_line['topic']
    if (topic == 'cart/cartId/raw_ble'):
      continue
    if (topic == 'cart/cartId/hall_reading'):
      continue
    #print '\n____________________________________'
    line_time = parsed_line['start_time']
    if not record_start_time:
      record_start_time = line_time
    time_since_record_start = parsed_line['start_time'] - record_start_time
    """while (True):
      time_since_play_start = int(time.time()) - play_start_time
      print ('time_since_record_start', time_since_record_start)
      print ('time_since_play_start', time_since_play_start)
      wait = time_since_record_start >= time_since_play_start
      if not wait:
        break 
      time.sleep(1)"""
    parsed_line.pop('topic', 0)
    pub(topic, json.dumps(parsed_line))
    print (topic, parsed_line)
    
  log_file.close()
  
def main(argv):
  log_file_name = 'tiny.dat'
  try:
    opts, args = getopt.getopt(argv,"hi:",["infile="])
  except getopt.GetoptError:
    print 'python cart_detector.py -i <log_file>'
    sys.exit(2)
  for opt, arg in opts:
    if opt == '-h':
      print 'python cart_detector.py -i <log_file>'
      sys.exit()
    elif opt in ("-i", "--infile"):
      log_file_name = arg
    publish_log(log_file_name)
  
  
if __name__ == '__main__':
    main(sys.argv[1:])
