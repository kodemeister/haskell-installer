class Component {
  constructor() {
    let platforms = [];

    for (const platform of platforms) {
      const componentName = `${component.name}_${platform}`;
      installer.componentByName(componentName).setValue("Virtual", "false");
    }
  }
}
