using AutoMapper;
using LivestreamApp.Server.AppConfiguration;
using LivestreamApp.Service.AppConfiguration;
using LivestreamApp.Service.UriReservation;
using LivestreamApp.Shared.AppConfiguration;
using LivestreamApp.Shared.AppSettings;
using Ninject;
using Ninject.Extensions.Logging;
using System;
using Topshelf;

namespace LivestreamApp.Service
{
    internal class Program
    {
        public static void Main()
        {
            // Loading AutoMapper profiles
            Mapper.Initialize(config => config.AddProfiles(typeof(ServerProfile)));
            Mapper.AssertConfigurationIsValid();

            // Loading Ninject kernel
            IKernel kernel = new StandardKernel();
            kernel.Load(new ServiceModule(), new SharedModule());
            var livestreamApp = kernel.Get<Startup.Service>();

            // Get logger for top level logging
            var logger = kernel.Get<ILoggerFactory>().GetCurrentClassLogger();

            // Url registration and firewall
            var appSettingsprovider = kernel.Get<IAppSettingsProvider>();
            var port = appSettingsprovider.GetIntValue(AppSetting.DefaultPort);

            // Run Topshelf
            var host = HostFactory.New(x =>
            {
                x.UseNLog();
                x.Service<Startup.Service>(s =>
                {
                    s.ConstructUsing(name => livestreamApp);
                    s.WhenStarted(ls => ls.Start());
                    s.WhenStopped(ls => ls.Stop());
                });
                x.WithUriReservation(r =>
                {
                    r.AddHost(port: 20005);
                    r.CreateUrlReservationsOnInstall();
                    r.OpenFirewallPortsOnInstall("LivestreamApp.Service");
                    r.DeleteReservationsOnUnInstall();
                });
                x.RunAsLocalSystem();
                x.RunAsNetworkService();
                x.SetDescription("A service for live streaming app");
                x.SetDisplayName("LivestreamApp.Service");
                x.SetServiceName("LivestreamApp.Service");
            });

            try
            {
                host.Run();
            }
            catch (Exception ex)
            {
                logger.Error("An top level exception occurred.");
                logger.Error(ex.Message);
            }

            Console.WriteLine("Please press enter to exit.");
            Console.ReadLine();
        }
    }
}