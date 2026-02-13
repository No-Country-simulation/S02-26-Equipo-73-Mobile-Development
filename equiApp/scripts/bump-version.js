#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script para incrementar automáticamente la versión de la app
 * Actualiza: package.json, app.json y android/app/build.gradle
 */

const rootDir = path.join(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const appJsonPath = path.join(rootDir, 'app.json');
const buildGradlePath = path.join(rootDir, 'android', 'app', 'build.gradle');

// Tipo de incremento (patch, minor, major)
const bumpType = process.argv[2] || 'minor';

/**
 * Incrementa la versión según el tipo especificado
 */
function bumpVersion(version, type) {
  const parts = version.split('.').map(Number);
  
  switch (type) {
    case 'major':
      parts[0] += 1;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1] += 1;
      parts[2] = 0;
      break;
    case 'patch':
    default:
      parts[2] += 1;
      break;
  }
  
  return parts.join('.');
}

/**
 * Actualiza package.json
 */
function updatePackageJson(newVersion) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const oldVersion = packageJson.version;
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  return oldVersion;
}

/**
 * Actualiza app.json
 */
function updateAppJson(newVersion) {
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  appJson.expo.version = newVersion;
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
}

/**
 * Actualiza android/app/build.gradle
 */
function updateBuildGradle(newVersion) {
  let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
  
  // Incrementar versionCode
  const versionCodeMatch = buildGradle.match(/versionCode\s+(\d+)/);
  if (versionCodeMatch) {
    const oldVersionCode = parseInt(versionCodeMatch[1]);
    const newVersionCode = oldVersionCode + 1;
    buildGradle = buildGradle.replace(
      /versionCode\s+\d+/,
      `versionCode ${newVersionCode}`
    );
    console.log(`  📱 Android versionCode: ${oldVersionCode} → ${newVersionCode}`);
  }
  
  // Actualizar versionName
  buildGradle = buildGradle.replace(
    /versionName\s+"[^"]+"/,
    `versionName "${newVersion}"`
  );
  
  fs.writeFileSync(buildGradlePath, buildGradle);
}

/**
 * Función principal
 */
function main() {
  try {
    console.log('\n🚀 Actualizando versión de la app...\n');
    
    // Leer versión actual
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const currentVersion = packageJson.version;
    
    // Calcular nueva versión
    const newVersion = bumpVersion(currentVersion, bumpType);
    
    console.log(`  📦 Versión: ${currentVersion} → ${newVersion} (${bumpType})`);
    
    // Actualizar archivos
    updatePackageJson(newVersion);
    console.log(`  ✅ package.json actualizado`);
    
    updateAppJson(newVersion);
    console.log(`  ✅ app.json actualizado`);
    
    updateBuildGradle(newVersion);
    console.log(`  ✅ android/app/build.gradle actualizado`);
    
    console.log(`\n✨ Versión actualizada exitosamente a ${newVersion}\n`);
  } catch (error) {
    console.error('\n❌ Error al actualizar la versión:', error.message);
    process.exit(1);
  }
}

main();
