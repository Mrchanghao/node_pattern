resources = [socketA, socketB, socketC];

while(!resources.isEmpty()) {
  for(let i = 0; i < resources.length; i++) {
    resource = resources[i];
  // reading
    let data = resource.read();
    if(data == NO_DATA_AVAILABLE)
      continue;
    if(data == RESOURCE_CLOSED)
      resources.remove(i)
    else 
      consumeData(data);
  }
}